import { game } from "../game";

test('create new game', () => {
    const rows = 5;
    const columns = 5;
    const theGame = game.newGame(5, 5);
    let estimatedBombs = Math.floor(rows * columns * game.BOMBS_PROBABILITY);
    expect(theGame.totalBombs).toBeGreaterThanOrEqual(estimatedBombs);
});


test('fill mines count 2x1', () => {
    const state = [[
        {
            "position": { x: 0, y: 0 },
            "isOpened": false,
            "mines": -1,
            "isFlagged": true
        },
        {
            "position": { x: 0, y: 1 },
            "isOpened": true,
            "mines": 0,
            "isFlagged": false
        }
    ]];

    game.fillBombsCount(state);
    expect(state[0][1].mines).toBe(1);
});

test('fill mines count 2x2', () => {
    const state = [[
        {
            "position": { x: 0, y: 0 },
            "isOpened": false,
            "mines": -1,
            "isFlagged": true
        },
        {
            "position": { x: 0, y: 1 },
            "isOpened": true,
            "mines": 0,
            "isFlagged": false
        }
    ], [
        {
            "position": { x: 1, y: 0 },
            "isOpened": false,
            "mines": -1,
            "isFlagged": true
        },
        {
            "position": { x: 1, y: 1 },
            "isOpened": true,
            "mines": 0,
            "isFlagged": false
        }
    ]];

    game.fillBombsCount(state);
    expect(state[0][1].mines).toBe(2);
    expect(state[1][1].mines).toBe(2);
});

test('game is completed', () => {
    const givenGame = {
        "state": [[
            {
                "position": { x: 0, y: 0 },
                "isOpened": false,
                "mines": -1,
                "isFlagged": true
            },
            {
                "position": { x: 0, y: 1 },
                "isOpened": true,
                "mines": 1,
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
            "position": { x: 0, y: 0 },
            "isOpened": false,
            "mines": -1,
            "isFlagged": true
        }, {
            "position": { x: 0, y: 1 },
            "isOpened": true,
            "mines": 1,
            "isFlagged": false
        }], [{
            "position": { x: 1, y: 0 },
            "isOpened": true,
            "mines": 2,
            "isFlagged": true
        }, {
            "position": { x: 1, y: 1 },
            "isOpened": false,
            "mines": -1,
            "isFlagged": true
        }]],
        "exploded": false,
        "totalBombs": 2
    };

    const isCompleted = game.checkCompleted(givenGame);
    expect(isCompleted).toBeTruthy();
});