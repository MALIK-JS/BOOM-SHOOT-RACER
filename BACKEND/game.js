const { GRID_SIZE } = require("./constants");

module.exports = {
  createGameState,
  gameLoop,
  getUpdateVelocity,
};

function createGameState(type) {
  if (type === "multiple") {
    return {
      players: [
        {
          pos: {
            x: 3,
            y: 10,
          },
          vel: {
            x: 1,
            y: 0,
          },
          fuellevel: 100,
        },
        {
          pos: {
            x: 2,
            y: 5,
          },
          vel: {
            x: 1,
            y: 0,
          },
          fuellevel: 100,
        },
      ],
      fuel: {
        x: 7,
        y: 7,
      },
      block: {
        pos: { x: 0, y: 0 },
        vel: {
          x: 1,
          y: Math.random(),
        },
      },
      gridSize: GRID_SIZE,
    };
  } else {
    return {
      player: { pos: { x: 3, y: 10 }, vel: { x: 1, y: 0 }, fuellevel: 100 },
      fuel: { x: 7, y: 7 },
      block: {
        pos: { x: 0, y: 0 },
        vel: {
          x: 1,
          y: Math.random(),
        },
      },
      gridSize: GRID_SIZE,
    };
  }
}
const retured = false;
function gameLoop(state) {
  if (!state) {
    return;
  }
  const block = state.block;

  block.pos.x += block.vel.x;
  block.pos.y += block.vel.y;

  if (block.pos.x >= state.gridSize || block.pos.x <= 0)
    block.vel.x = 0 - block.vel.x;

  if (block.pos.y >= state.gridSize - 1 || block.pos.y <= 0)
    block.vel.y = 0 - block.vel.y;

  if (state.hasOwnProperty("player")) {
    const playerOne = state.player;

    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    playerOne.fuellevel -= 1;

    if (
      (state.fuel.x - 1 === playerOne.pos.x &&
        state.fuel.y - 1 === playerOne.pos.y) ||
      (state.fuel.x === playerOne.pos.x && state.fuel.y === playerOne.pos.y)
    ) {
      playerOne.fuellevel = 100;
      sgrandomFuel(state);
    }

    if (
      block.pos.x === playerOne.pos.x &&
      Math.round(block.pos.y) === playerOne.pos.y
    ) {
      return 1;
    }

    if (playerOne.pos.x < 0) {
      playerOne.pos.x = GRID_SIZE - 1;
    }
    if (playerOne.pos.y < 0) {
      playerOne.pos.y = GRID_SIZE - 1;
    }

    if (playerOne.pos.x >= GRID_SIZE) {
      playerOne.pos.x = 0;
    }
    if (playerOne.pos.y >= GRID_SIZE) {
      playerOne.pos.y = 0;
    }
    if (playerOne.fuellevel <= 0) {
      return 1;
    }
  } else {
    const playerOne = state.players[0];
    const playerTwo = state.players[1];

    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;

    playerOne.fuellevel -= 1;
    playerTwo.fuellevel -= 1;

    if (
      block.pos.x === playerOne.pos.x &&
      Math.round(block.pos.y) === playerOne.pos.y
    ) {
      return 2;
    }

    if (
      block.pos.x === playerTwo.pos.x &&
      Math.round(block.pos.y) === playerTwo.pos.y
    ) {
      return 1;
    }

    if (
      (state.fuel.x - 1 === playerOne.pos.x &&
        state.fuel.y - 1 === playerOne.pos.y) ||
      (state.fuel.x === playerOne.pos.x && state.fuel.y === playerOne.pos.y)
    ) {
      playerOne.fuellevel = 100;
      randomFuel(state);
    }

    if (
      (state.fuel.x - 1 === playerTwo.pos.x &&
        state.fuel.y - 1 === playerTwo.pos.y) ||
      (state.fuel.x === playerTwo.pos.x && state.fuel.y === playerTwo.pos.y)
    ) {
      playerTwo.fuellevel = 100;
      randomFuel(state);
    }

    if (playerOne.pos.x < 0) {
      playerOne.pos.x = GRID_SIZE - 1;
    }
    if (playerOne.pos.y < 0) {
      playerOne.pos.y = GRID_SIZE - 1;
    }

    if (playerOne.pos.x >= GRID_SIZE) {
      playerOne.pos.x = 0;
    }
    if (playerOne.pos.y >= GRID_SIZE) {
      playerOne.pos.y = 0;
    }
    if (playerOne.fuellevel <= 0) {
      return 2;
    }

    if (playerTwo.pos.x < 0) {
      playerTwo.pos.x = GRID_SIZE - 1;
    }
    if (playerTwo.pos.y < 0) {
      playerTwo.pos.y = GRID_SIZE - 1;
    }

    if (playerTwo.pos.x >= GRID_SIZE) {
      playerTwo.pos.x = 0;
    }
    if (playerTwo.pos.y >= GRID_SIZE) {
      playerTwo.pos.y = 0;
    }
    if (playerTwo.fuellevel <= 0) {
      return 1;
    }
  }
}

function playerLoop(playerobj) {}

function randomFuel(state) {
  fuel = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
  if (fuel.x === state.players[0].pos.x && fuel.y === state.players[0].pos.y) {
    return randomFuel(state);
  }
  if (fuel.x === state.players[1].pos.x && fuel.y === state.players[1].pos.y) {
    return randomFuel(state);
  }
  state.fuel = fuel;
}

function sgrandomFuel(state) {
  fuel = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
  if (fuel.x === state.player.pos.x && fuel.y === state.player.pos.y) {
    return sgrandomFuel(state);
  }
  if (fuel.x === state.player.pos.x && fuel.y === state.player.pos.y) {
    return sgrandomFuel(state);
  }
  state.fuel = fuel;
}

function getUpdateVelocity(keycode) {
  switch (keycode) {
    case 37: {
      // left
      return { x: -1, y: 0 };
    }
    case 38: {
      // down
      return { x: 0, y: -1 };
    }

    case 39: {
      // right
      return { x: 1, y: 0 };
    }

    case 40: {
      // up
      return { x: 0, y: 1 };
    }
  }
}
