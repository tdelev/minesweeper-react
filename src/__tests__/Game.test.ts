import { checkCompleted } from "./../Game";

test('game is completed', () => {
  const state = {
    "state": [
      [
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 0,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 0,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 0,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 0,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 0,
          "marked": false
        }
      ],
      [
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 0,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 2,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 2,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        }
      ],
      [
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 2,
          "marked": false
        },
        {
          "isOpened": false,
          "isBomb": true,
          "bombs": -1,
          "marked": true
        },
        {
          "isOpened": false,
          "isBomb": true,
          "bombs": -1,
          "marked": true
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        }
      ],
      [
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        },
        {
          "isOpened": false,
          "isBomb": true,
          "bombs": -1,
          "marked": true
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 3,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 2,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        }
      ],
      [
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 1,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 0,
          "marked": false
        },
        {
          "isOpened": true,
          "isBomb": false,
          "bombs": 0,
          "marked": false
        }
      ]
    ]
  };

  const isCompleted = checkCompleted(state);
  console.log(isCompleted);
  expect(isCompleted).toBeTruthy();
})