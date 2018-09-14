export interface Point {
    x: number;
    y: number;
}

/**
 * mines = -1 - it is a bomb
 * mines >= 0 - count of mines around
 */
export class Mine {
    constructor(public position: Point,
                public isOpened = false,
                public mines = 0,
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