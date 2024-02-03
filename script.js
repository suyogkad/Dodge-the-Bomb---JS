var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
var life = 3; // character lives
var score = 0; // initial score

var bombs = [];

var explosions = [];

function renderBombs() {
  document.getElementById("score").innerHTML = "score: " + score;
  if (life > 0) {
    drawBombs();
    moveBombs();
  }
}

function drawBombs() {
  document.getElementById("bombs").innerHTML = "";
  for (var bomb = 0; bomb < bombs.length; bomb = bomb + 1) {
    document.getElementById(
      "bombs"
    ).innerHTML += `<div class='bomb' style='left:${bombs[bomb].left}px;
		top:${bombs[bomb].top}px;'></div>`;
  }
}

function deleteExplosions() {
  document.getElementById("explosions").innerHTML = "";
  //clearing explosions
}

function moveBombs() {
  for (var bomb = 0; bomb < bombs.length; bomb = bomb + 1) {
    bombs[bomb].top = bombs[bomb].top + 3;
  }
  if (life > 0) {
    groundhitBombs();
  }
}

function addBombs() {
  bombs.push({ left: Math.floor(Math.random() * 1920 + 1), top: -2 });
}
//adding bomb with a random horizontal location starting offscreen (-2 px top)

function groundhitBombs() {
  for (var bomb = 0; bomb < bombs.length; bomb = bomb + 1) {
    contactPoint = bombs[bomb].left;
    var hitGround = Math.floor(Math.random() * 900 + 700);

    if (bombs[bomb].top >= hitGround) {
      var div = document.getElementById("player");
      var hero = div.getBoundingClientRect();
      x = hero.left;
      y = hero.top;
      w = hero.width;
      h = hero.height;

      if (
        y <= bombs[bomb].top + 80 &&
        y >= bombs[bomb].top - 80 &&
        x >= bombs[bomb].left - 16 &&
        x <= bombs[bomb].left + 16
      ) {
        life = life - 1;
        document.getElementById("player").classList = "character hit left";

        if (life == 2) {
          document.getElementById("health").innerHTML = `<li></li><li></li>`;
        }

        if (life == 1) {
          document.getElementById("health").innerHTML = `<li></li>`;
        }

        if (life == 0) {
          document.getElementById("health").innerHTML = "";
          document.getElementById("player").classList = "character stand dead";
          bombs.splice(0, bombs.length);
          explosions.splice(0, explosions.length);
          gameOver();
        }
      }

      score = score + 1;
      document.getElementById("score").innerHTML = "score: " + score;
      bombs.splice(bomb, 1);

      //creating explosion div with class .explosion
      document.getElementById(
        "explosions"
      ).innerHTML += `<div class='explosion' style='left:${contactPoint}px;
			top:${hitGround}px;'></div>`;
    }
  }
}

function gameOver() {
  bombs.splice(0, bombs.length);
  explosions.splice(0, explosions.length);
  clearInterval(renderBombs);
  clearInterval(addBombs);
  document.getElementById("gameOver").innerHTML = "";
  document.getElementById("gameOver").innerHTML += "score: " + score;
  document.getElementById("gameOver").innerHTML += `<br>GAME OVER!!!`;
  document.getElementById(
    "gameOver"
  ).innerHTML += `<div class='gameOver'><a href="#" onclick="startGame()">Play again</a></div>`;
  let y = document.getElementById("score");
  y.style.display = "none";
  let x = document.getElementById("gameOver");
  x.style.display = "inline";
}

function gameLoop() {
  setInterval(deleteExplosions, 100); //explosion length
  setInterval(addBombs, 1000); //add bombs to the queue 1 bombs per 0.5sec
  setInterval(renderBombs, 10); // drawing new position of the bomb
  startGame();
}

function startGame() {
  let y = document.getElementById("gameOver");
  y.style.display = "none"; // hiding gameover screen

  bombs.splice(0, bombs.length); //// clearing bombs array

  life = 3; // character lives reset
  score = 0; // initial score reset

  if (life == 3) {
    document.getElementById("health").innerHTML = `<li></li><li></li><li></li>`;
  }
  document.getElementById("player").classList = "character stand down";
  let x = document.getElementById("start");
  x.style.display = "none";
  let z = document.getElementById("score");
  z.style.display = "inline";
}

function keyup(event) {
  var player = document.getElementById("player");
  if (event.keyCode == 37) {
    leftPressed = false;
    lastPressed = "left";
  }
  if (event.keyCode == 39) {
    rightPressed = false;
    lastPressed = "right";
  }
  if (event.keyCode == 38) {
    upPressed = false;
    lastPressed = "up";
  }
  if (event.keyCode == 40) {
    downPressed = false;
    lastPressed = "down";
  }

  player.className = "character stand " + lastPressed;
}

function move() {
  var player = document.getElementById("player");
  var positionLeft = player.offsetLeft;
  var positionTop = player.offsetTop;
  if (downPressed) {
    var newTop = positionTop + 2;

    var element = document.elementFromPoint(player.offsetLeft, newTop + 32);
    if (element.classList.contains("sky") == false) {
      player.style.top = newTop + "px";
    }

    if (leftPressed == false) {
      if (rightPressed == false) {
        player.className = "character walk down";
      }
    }
  }

  if (upPressed) {
    var newTop = positionTop - 2;

    var element = document.elementFromPoint(player.offsetLeft, newTop);
    if (element.classList.contains("sky") == false) {
      player.style.top = newTop + "px";
    }

    if (leftPressed == false) {
      if (rightPressed == false) {
        player.className = "character walk up";
      }
    }
  }
  if (leftPressed) {
    var newLeft = positionLeft - 2;

    var element = document.elementFromPoint(newLeft, player.offsetTop);
    if (element.classList.contains("sky") == false) {
      player.style.left = newLeft + "px";
    }

    player.className = "character walk left";
  }
  if (rightPressed) {
    var newLeft = positionLeft + 2;

    var element = document.elementFromPoint(newLeft + 32, player.offsetTop);
    if (element.classList.contains("sky") == false) {
      player.style.left = newLeft + "px";
    }

    player.className = "character walk right";
  }
}

function keydown(event) {
  if (event.keyCode == 37) {
    leftPressed = true;
  }
  if (event.keyCode == 39) {
    rightPressed = true;
  }
  if (event.keyCode == 38) {
    upPressed = true;
  }
  if (event.keyCode == 40) {
    downPressed = true;
  }
}

function myLoadFunction() {
  timeout = setInterval(move, 10);
  document.addEventListener("keydown", keydown);
  document.addEventListener("keyup", keyup);
}

document.addEventListener("DOMContentLoaded", myLoadFunction);
