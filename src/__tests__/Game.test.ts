import { checkCompleted } from "../Game";

test('game is completed', () => {
    const game = {
        "state": [[
            {
                "position": { x: 0, y: 0 },
                "isOpened": false,
                "bombs": -1,
                "isFlagged": true
            },
            {
                "position": { x: 0, y: 1 },
                "isOpened": true,
                "bombs": 1,
                "isFlagged": false
            }
        ]],
        "exploded": false,
        "totalBombs": 1
    };

    const isCompleted = checkCompleted(game);
    expect(isCompleted).toBeTruthy();
});

test('two bomb game is completed', () => {
    const game = {
        "state": [[{
            "position": { x: 0, y: 0 },
            "isOpened": false,
            "bombs": -1,
            "isFlagged": true
        }, {
            "position": { x: 0, y: 1 },
            "isOpened": true,
            "bombs": 1,
            "isFlagged": false
        }], [{
            "position": { x: 1, y: 0 },
            "isOpened": true,
            "bombs": 2,
            "isFlagged": true
        }, {
            "position": { x: 1, y: 1 },
            "isOpened": false,
            "bombs": -1,
            "isFlagged": true
        }]],
        "exploded": false,
        "totalBombs": 2
    };

    const isCompleted = checkCompleted(game);
    expect(isCompleted).toBeTruthy();
});