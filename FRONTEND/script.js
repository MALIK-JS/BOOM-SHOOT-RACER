const BG_COLOUR = "black";
const PLAYER_COLOUR = "#2BC210";
const PLAYER_COLOUR_TWO = "#1339d1";

const FUEL_COLOUR = "red";
let canvas, ctx, fuel, playerNumber;

const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameBtn = document.getElementById("newGameButton");
const joinGameBtn = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");
const newGameComp = document.getElementById("newGameComp");
const fuelbarone = document.getElementById("greenBarone");
const fuelbartwo = document.getElementById("blueBartwo");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelectorAll("#HowToButton");
const watchGmButton = document.getElementById("watchGameButton");

// popup window source code start here
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

const fuelBarScPlyr = document.getElementById("playerTwoBar");

const gameCodeLine = document.getElementById("gameCoding");

var socket = io("https://immense-fortress-16826.herokuapp.com/");

socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownCode", handleunknownGame);
socket.on("tooManyPlayer", handletooManyPlayer);
socket.on("hideCodeDisplkay", handlehideCodeDisplkay);

function handlehideCodeDisplkay() {
  console.log("received");
  gameCodeLine.style.display = "none";
}

function handleInit(number) {
  playerNumber = number;
}

function handleGameState(gameState) {
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
  ctx.clearRect(0, 0, canvas.width, canvas.width);
}

function handleGameOver(data = 0) {
  if (!data) {
    displayGameOver();
    return;
  }
  data = JSON.parse(data);
  if (data.winner === playerNumber) {
    displayYouWin();
  } else {
    displayGameOver();
  }
  gameActive = false;
}

function handleGameCode(gameCode) {
  gameCodeDisplay.textContent = gameCode;
}

newGameBtn.addEventListener("click", newGame);
function newGame() {
  socket.emit("newGame");
  init();
}

joinGameBtn.addEventListener("click", joinGame);
function joinGame() {
  const gameCode = gameCodeInput.value;
  socket.emit("joinGame", gameCode);
  init();
}

// single version
newGameComp.addEventListener("click", newGameCmp);
function newGameCmp() {
  socket.emit("newGameCmp");
  init();
  gameCodeLine.style.display = "none";
  fuelBarScPlyr.style.display = "none";
}

watchGmButton.addEventListener("click", watchGame);

function watchGame() {
  const gameCode = gameCodeInput.value;
  init();
  socket.emit("watchGame", gameCode);
}

function handleunknownGame() {
  reset();
  alert("UNKNOWN GAME CODE");
}

function handletooManyPlayer() {
  reset();
  alert("THIS GAME IS ALREADY IN PROGRESS");
}

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "flex";
  canvas = document.getElementById("game-scrn");
  ctx = canvas.getContext("2d");
  canvas.height = 700;
  canvas.width = 700;
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.height, canvas.width);
  document.body.addEventListener("keydown", keyDown);
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = "";
  gameCodeDisplay.textContent = "";
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}

function keyDown(event) {
  // console.log("code clnt ", event.keyCode);
  socket.emit("keydown", event.keyCode);
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
}
let counter = 0;
function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.height, canvas.width);
  const fuel = state.fuel;
  const gridSize = state.gridSize;
  const size = canvas.width / gridSize;
  ctx.fillStyle = FUEL_COLOUR;
  ctx.beginPath();
  ctx.arc(fuel.x * size, fuel.y * size, size / 2, 0, 2 * Math.PI, false);
  ctx.fill();

  if (state.hasOwnProperty("players")) {
    const playerOne = state.players[0].pos;
    const playerTwo = state.players[1].pos;
    ctx.fillStyle = PLAYER_COLOUR;
    ctx.fillRect(playerOne.x * size, playerOne.y * size, size, size);

    ctx.fillStyle = PLAYER_COLOUR_TWO;
    ctx.fillRect(playerTwo.x * size, playerTwo.y * size, size, size);
    setTimeout(frame, 100);

    function frame() {
      fuelbarone.style.width = state.players[0].fuellevel + "%";
      fuelbartwo.style.width = state.players[1].fuellevel + "%";
    }

    fuelbarone.textContent = state.players[0].fuellevel;
    fuelbartwo.textContent = state.players[1].fuellevel;
  } else {
    const playerOne = state.player.pos;
    ctx.fillStyle = PLAYER_COLOUR;

    ctx.fillRect(playerOne.x * size, playerOne.y * size, size, size);

    setTimeout(frame, 100);

    function frame() {
      fuelbarone.style.width = state.player.fuellevel + "%";
    }

    fuelbarone.textContent = state.player.fuellevel;
  }
  ctx.fillStyle = counter % 3 === 0 ? "blue" : "red";

  ctx.fillRect(state.block.pos.x * size, state.block.pos.y * size, size, size);
  counter++;
  // fuelbar.style.width = state.player.fuellevel;
}

function displayGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "50px Verdana";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
}

function displayYouWin() {
  ctx.fillStyle = "white";
  ctx.font = "50px Verdana";
  ctx.fillText("you win.", canvas.width / 2, canvas.height / 2);
}
