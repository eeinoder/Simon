/* TODO:

BUGS:
(FIXED) Button stays highlighted after game loss
Button stays in pressed state (i.e. brightness 0.8) in mobile - makes it difficult to tell if its been pressed

Visual:
Custom buttons
Change game button colors

Gameplay:
(DONE) "Freeze" user input in middle of Classic sequence to avoid misclick
Add keyboard functionality -> can enter key presses to play game. (Can change hot keys?)
Add "Quit/Reset" option to stop
Add Leaderboard - make database, prompt for user id/"nick name", save with hi score
Add second layout option: Line AND Square
Add slider to change button sizes (?)
Add MORE BUTTONS
*/

var isGameStart = 0; //aka, false at the beginning
var isInSequence = 0; //if true, user's clicks should not be counted.
var num_butts = 0;
var game_mode = null;
var buttons_clicked = 0;
var games_played = 0;

var hi_score_cla = 0;   // reset when window is opened (?)
var hi_score_adv = 0;
var curr_score = 0; // reset when 'start' clicked
var curr_color_id = null;
var colorArr = [];
var curr_speed = 500; // 1000 ms = 1s is default inital delay

// Create new sound objects for sound effects.
/* var cNote = new sound("c_note.m4a");
var eNote = new sound("e_note.m4a");
var gNote = new sound("g_note.m4a");
var c2Note = new sound("c2_note.m4a"); */

// On/Off state of buttons represented by a diff val of opacity.
const ON = 1.0;
const OFF = 0.5;

var start_butt = document.getElementById('start');

const clrs = ["fd747d","fdc674","fdf674","7bf184","90ccfd","9c90fd","eb90fd"]; // Pastel rainbow
var colorMap = ["red", "green", "blue", "yellow"];

/* Start game after start button pressed */
start_butt.addEventListener('click', startGame);

function startGame() {
  if (isGameStart === 1) {
    // cannot Start a game while one is in progress OR if mode is not selected.
    alert("Game is already in progress.");
    return;
  }
  if (game_mode === null) {
    alert("Select game mode.");
    return;
  }
  // Set initial game paramters.
  isGameStart = 1;
  isInSequence = 0;
  curr_score = 0;
  curr_color_id = 0;
  colorArr = [];
  curr_speed = 500;
  num_butts = document.getElementsByClassName("gamebutton").length; //TODO: only select those visible
  games_played++;
  document.getElementById("numGames").innerHTML = games_played;
  // Update score values.
  updateScores();
  chooseButton();
}

/* startGame() calls this initially. Wait for EventListener on buttons. Calls
chooseButton() if selection is correct. */
// Loop through colorArr for "classic" mode.
// Don't loop for
function chooseButton() {
  var rand_butt = Math.floor(Math.random() * num_butts);
  colorArr.push(colorMap[rand_butt]); // Choose random color. Store in the colorArr.
  console.log(colorArr);
  isInSequence = 1;                 // Com is choosing/displaying color sequence.
  console.log(isInSequence);
  if (game_mode === "classic") {
    var len = colorArr.length;
    for (var i=0; i<2*len; i++) {
      // Use Math.floor to toggle each light twice (on then off).
      (function(i){
        setTimeout(function() {
          toggleButton(colorArr[Math.floor(i/2)]);
          if (i === 2*len - 1) {
            isInSequence = 0;
            console.log(isInSequence);
          }
        }, curr_speed*(i+1));
      })(i);
    }
  }
  else if (game_mode === "advanced") {
    console.log(colorMap[rand_butt]);
    setTimeout(function() {toggleButton(colorMap[rand_butt]);}, curr_speed); //asynchronous
    setTimeout(function() {
      toggleButton(colorMap[rand_butt]);
      isInSequence = 0;
      console.log(isInSequence);
    }, curr_speed*2);
  }
  curr_speed = curr_speed * 0.9;// Increase speed.
}

// handler: change button opacity when bot chooses button
//NOTE: toggle math relies on 0.5, 1.0 val to toggle: 0.5 -> 1.0; 1.0 -> 0.5
function toggleButton (color) {
  var targetButton = document.getElementById(color);
  var opacity = targetButton.style.opacity;
  targetButton.style.opacity = ((opacity*10)%10 + 5) / 10;
}
// handler:compare user selection with bot selection
function compareButton(usr_color) {
  var buttonObj = document.getElementById(usr_color);
  if (usr_color === colorArr[curr_color_id]) {
    // if correct: inc score (if hi score is equal to score before inc, inc both);
    curr_color_id++;
    //console.log("curr_id: " + curr_color_id);
    //console.log("num colors: " + colorArr.length);
    // if that was last one in array, call choose button
    //TODO: increment speed
    if (curr_color_id === colorArr.length) {
      console.log("Correct!");
      if (game_mode === "classic") {
        if (hi_score_cla === curr_score) {hi_score_cla++;}
      }
      else if (game_mode === "advanced") {
        if (hi_score_adv === curr_score) {hi_score_adv++;}
      }
      curr_score++;
      curr_color_id = 0;
      chooseButton();
    }
  }
  else {
    var hi_score;
    alert("You lose!")
    if (game_mode === "classic") {hi_score = hi_score_cla;}
    else if (game_mode === "advanced") {hi_score = hi_score_adv;}
    if (curr_score === hi_score) {alert("New High Score!")}
    isGameStart = 0;
    curr_score = 0;
    // Set button vis settings to default
    buttonObj.style.filter = "brightness(1.0)";
    buttonObj.style.opacity = 0.5;
    buttonObj.style.boxShadow = "none";
  }
  updateScores();
}
//handler: update vals if answer is correct
function updateScores() {
  var hi_score;
  if (game_mode === "classic") {hi_score = hi_score_cla;}
  else if (game_mode === "advanced") {hi_score = hi_score_adv;}
  var hiscore_str = "High Score: " + hi_score;
  var score_str = "Score: " + curr_score;
  document.getElementById("hi-score").innerHTML = hiscore_str;
  document.getElementById("score").innerHTML = score_str;
  document.getElementById("hiScoreCla").innerHTML = hi_score_cla;
  document.getElementById("hiScoreAdv").innerHTML = hi_score_adv;
}


/* GAME BUTTONS EVENT LISTENER */
const wrapper = document.getElementById('buttons');
wrapper.addEventListener('mousedown', (event) => {      // Register click and
  const isButton = event.target.nodeName === 'BUTTON';  // do click effects.
  if (!isButton) {return;}
  else {
    event.target.style.opacity = 1.0;
    event.target.style.boxShadow = "0 0 5px 5px grey";
    buttons_clicked++;
    document.getElementById("numClicks").innerHTML = buttons_clicked;
    if (isGameStart === 1 && isInSequence === 0) {
      compareButton(event.target.id);
    }
  }
});
wrapper.addEventListener('mouseup', (event) => {        // Click up.
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {return;}
  event.target.style.opacity = 0.5;
  event.target.style.boxShadow = "none";
});
wrapper.addEventListener('mouseover', (event) => {     // Hover in: make darker.
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {return;}
  event.target.style.filter = "brightness(0.75)";
});
wrapper.addEventListener('mouseout', (event) => {     // Hover out: make brighter.
  const isButton = event.target.nodeName === 'BUTTON';  // Revert click effects if
  if (!isButton) {return;}                              // click up happens outside
  event.target.style.filter = "brightness(1.0)";                 // button box.
  event.target.style.opacity = 0.5;
  event.target.style.boxShadow = "none";
});





/* End of script */
