import { checkCompleted } from "../Game";

test('game is completed', () => {
    const state = {
        "state": [[
            {
                "position": {x: 0, y: 0},
                "isOpened": false,
                "isMine": true,
                "bombs": -1,
                "isMarked": true
            },
            {
                "position": {x: 0, y: 1},
                "isOpened": true,
                "isMine": false,
                "bombs": 1,
                "isMarked": false
            }
        ]]
    };

    const isCompleted = checkCompleted(state);
    expect(isCompleted).toBeTruthy();
});