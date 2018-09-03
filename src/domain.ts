export interface Point {
    x: number;
    y: number;
}

/**
 * bombs = -1 - it is a bomb
 * bombs >= 0 - count of bombs around
 */
export class Mine {
    constructor(public position: Point,
                public isOpened = false,
                public bombs = 0,
                public isFlagged = false,
    ) {
    }
}

export class Game {
    constructor(public state: Array<Array<Mine>>,
                public totalBombs = 0,
                public exploded = false
    ) {
    }
}