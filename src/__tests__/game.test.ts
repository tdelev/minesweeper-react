import { game } from "../game";
import { test, expect } from 'vitest';

test('create new game', () => {
    const rows = 5;
    const columns = 5;
    const theGame = game.newGame(5, 5);
    const estimatedBombs = Math.floor(rows * columns * game.BOMBS_PROBABILITY);
    expect(theGame.totalBombs).toBeGreaterThanOrEqual(estimatedBombs);
});


test('fill bombs count 2x1', () => {
    const state = [[
        {
            "position": {x: 0, y: 0},
            "isOpened": false,
            "bombs": -1,
            "isFlagged": true
        },
        {
            "position": {x: 0, y: 1},
            "isOpened": true,
            "bombs": 0,
            "isFlagged": false
        }
    ]];

    game.fillBombsCount(state);
    expect(state[0][1].bombs).toBe(1);
});

test('fill bombs count 2x2', () => {
    const state = [[
        {
            "position": {x: 0, y: 0},
            "isOpened": false,
            "bombs": -1,
            "isFlagged": true
        },
        {
            "position": {x: 0, y: 1},
            "isOpened": true,
            "bombs": 0,
            "isFlagged": false
        }
    ], [
        {
            "position": {x: 1, y: 0},
            "isOpened": false,
            "bombs": -1,
            "isFlagged": true
        },
        {
            "position": {x: 1, y: 1},
            "isOpened": true,
            "bombs": 0,
            "isFlagged": false
        }
    ]];

    game.fillBombsCount(state);
    expect(state[0][1].bombs).toBe(2);
    expect(state[1][1].bombs).toBe(2);
});

test('game is completed', () => {
    const givenGame = {
        "state": [[
            {
                "position": {x: 0, y: 0},
                "isOpened": false,
                "bombs": -1,
                "isFlagged": true
            },
            {
                "position": {x: 0, y: 1},
                "isOpened": true,
                "bombs": 1,
                "isFlagged": false
            }
        ]],
        "exploded": false,
        "totalBombs": 1
    };

    const isCompleted = game.checkCompleted(givenGame);
    expect(isCompleted).toBeTruthy();
});

test('two bomb game is completed', () => {
    const givenGame = {
        "state": [[{
            "position": {x: 0, y: 0},
            "isOpened": false,
            "bombs": -1,
            "isFlagged": true
        }, {
            "position": {x: 0, y: 1},
            "isOpened": true,
            "bombs": 1,
            "isFlagged": false
        }], [{
            "position": {x: 1, y: 0},
            "isOpened": true,
            "bombs": 2,
            "isFlagged": true
        }, {
            "position": {x: 1, y: 1},
            "isOpened": false,
            "bombs": -1,
            "isFlagged": true
        }]],
        "exploded": false,
        "totalBombs": 2
    };

    const isCompleted = game.checkCompleted(givenGame);
    expect(isCompleted).toBeTruthy();
});
