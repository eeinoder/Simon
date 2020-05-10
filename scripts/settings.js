/* Settings.js */

/* GAME MODE EVENT LISTENERS */
var classic = document.getElementById('classic');
classic.addEventListener('click', toggleMode);
var advanced = document.getElementById('advanced');
advanced.addEventListener('click', toggleMode);
var help = document.getElementById('help');
help.addEventListener('click', (event => {
  alert("Classic play:\n\tRepeat the pattern correctly to increase your score." +
  "\n\nAdvanced play:\n\tLike classic play but only the last light in the new" +
  "\n\tsequence will be shown.");
}));

function toggleMode(e) {
  if (isGameStart === 1) {
    alert("Game already in progress.");
    return;
  }
  document.getElementById("mode").innerHTML = "Game Mode: " + e.target.id.toUpperCase();
  game_mode = e.target.id;
  updateScores(); // function() in gameCode.js
  console.log(game_mode);
}

/* GAME LAYOUT EVENT LISTENER */
/*
get number of buttons
*/

/* GAME STATS EVENT LISTENER */
var stats = document.getElementById('statsButton');
stats.addEventListener('click', (event) => {
  var statsBox = document.getElementById("statsBox");
  var vis = statsBox.style.visibility;
  //console.log(vis);
  if (vis === 'hidden') {statsBox.style.visibility = "visible";}
  else {statsBox.style.visibility = "hidden";}
});
