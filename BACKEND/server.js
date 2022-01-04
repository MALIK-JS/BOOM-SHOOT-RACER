const io = require("socket.io")(process.env.PORT || 8080, {
  cors: {
    origin: ["https://jovial-dubinsky-dadd96.netlify.app"],
  },
});

const { createGameState, gameLoop, getUpdateVelocity } = require("./game");
const { FRAME_RATE } = require("./constants");
const { makeid } = require("./utils");

const state = {};
const clientRooms = {};

io.on("connect", (client) => {
  //single player version
  client.on("newGameCmp", handlenewGameCmp);
  function handlenewGameCmp() {
    state["player"] = createGameState("single");
    startGameInterval("player", client);
  }

  //end single playet version

  client.on("newGame", handlenewGame);

  function handlenewGame() {
    let roomName = makeid(5);
    clientRooms[client.id] = roomName;
    client.emit("gameCode", roomName);
    state[roomName] = createGameState("multiple");

    client.join(roomName);
    client.number = 1;
    client.emit("init", 1);
  }

  client.on("keydown", handleKeydown);

  function handleKeydown(keyCode) {
    try {
      // console.log("code srvr ", keyCode);
      keyCode = parseInt(keyCode);
    } catch (e) {
      console.error(e);
      return;
    }
    if (state.hasOwnProperty("player", state.hasOwnProperty("player"))) {
      const vel = getUpdateVelocity(keyCode);
      if (vel) {
        state["player"].player.vel = vel;
      }
    } else {
      const roomName = clientRooms[client.id];
      if (!roomName) {
        return;
      }
      const vel = getUpdateVelocity(keyCode);
      if (vel) {
        state[roomName].players[client.number - 1].vel = vel;
      }
    }
  }

  client.on("joinGame", handlejoinGame);

  function handlejoinGame(roomName) {
    const clients = io.sockets.adapter.rooms.get(roomName);
    //to get the number of clients in this room
    const numClients = clients ? clients.size : 0;

    if (numClients === 0) {
      client.emit("unknownCode");
      return;
    } else if (numClients > 1) {
      client.emit("tooManyPlayers");
      return;
    }
    clientRooms[client.id] = roomName;

    client.join(roomName);
    client.number = 2;
    client.emit("init", 2);
    io.sockets.in(roomName).emit("hideCodeDisplkay");
    startGameInterval(roomName);
  }
  client.on("watchGame", handlewatchGame);

  function handlewatchGame(roomName) {
    const clients = io.sockets.adapter.rooms.get(roomName);
    const numClients = clients ? clients.size : 0;
    if (numClients === 0) {
      client.emit("unknownCode");
      return;
    }
    client.join(roomName);
    startGameIntervalWatching(roomName);
  }
});

function startGameIntervalWatching(roomName) {
  const intervalId = setInterval(() => {
    if (state[roomName]) {
      emitGameState(roomName, state[roomName]);
    } else clearInterval(intervalId);
  }, 1000 / FRAME_RATE);
}
function startGameInterval(roomName, client = null) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      if (roomName === "player") {
        client.emit("gameState", JSON.stringify(state[roomName]));
      } else emitGameState(roomName, state[roomName]);
      // client.emit("gameState", JSON.stringify(state));
    } else {
      if (roomName === "player") {
        client.emit("gameOver");
      } else {
        emitGameOver(roomName, winner);
        // client.emit("gameOver");
        state[roomName] = null;
      }
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, state) {
  io.sockets.in(roomName).emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName).emit("gameOver", JSON.stringify({ winner }));
}

// io.listen(8080);
