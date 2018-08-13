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
        "exploded": false
    };

    const isCompleted = checkCompleted(game);
    expect(isCompleted).toBeTruthy();
});