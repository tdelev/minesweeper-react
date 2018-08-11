import { Point } from "./components/Square";

export class Game {
    constructor(public state: Array<Array<BoardField>>) {
    }
}
const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

export const newGame = function (rows: number, columns: number): Game {
    const state = Array(rows).fill(null).map((r, i: number) => {
        return Array(columns).fill(null).map((c, j: number) => {
            const isBomb = Math.random() < 0.2;
            return new BoardField(false, isBomb, 0);
        });
    });
    for (let i = 0; i < state.length; ++i) {
        for (let j = 0; j < state[i].length; ++j) {
            const field = state[i][j];
            if (field.isBomb) {
                field.bombs = -1;
                for (let k = 0; k < dx.length; ++k) {
                    let ii = i + dx[k];
                    let jj = j + dy[k];
                    if (ii >= 0 && ii < state.length && jj >= 0 && jj < state[0].length) {
                        if (!state[ii][jj].isBomb)
                            state[ii][jj].bombs += 1;
                    }
                }
            }
        }
    }
    return new Game(state);
}

export const onOpen = function (game: Game, position: Point): Game {
    const opened = game.state[position.x][position.y];
    if (opened.isBomb) {
        return update(game.state, (field) => {
            return new BoardField(true, field.isBomb, field.bombs, field.marked);
        });
    } else {
        const openField = (openedField: BoardField) => (field: BoardField) => {
            if (field === openedField) {
                return new BoardField(true, field.isBomb, field.bombs, false);
            } else {
                return new BoardField(field.isOpened, field.isBomb, field.bombs, field.marked);
            }
        };
        let result = update(game.state, openField(opened));
        if (opened.bombs == 0) {
            const state = result.state;
            updateZeros(state, position);
        }
        return result;
    }
}

function updateZeros(fields: Array<Array<BoardField>>, start: Point) {
    for (let k = 0; k < dx.length; ++k) {
        let ii = start.x + dx[k];
        let jj = start.y + dy[k];
        if (ii >= 0 && ii < fields.length && jj >= 0 && jj < fields[0].length) {
            const neighborField = fields[ii][jj];
            if (!neighborField.isOpened) {
                neighborField.isOpened = true;
                if (neighborField.bombs == 0) {
                    updateZeros(fields, { x: ii, y: jj });
                }
            }
        }
    }
}

function update(fields: Array<Array<BoardField>>, f: ((b: BoardField) => BoardField)): Game {
    const updated = fields.slice().map(row => {
        return row.slice().map(field => {
            return f(field);
        });
    });
    return new Game(updated);
}

export const onGuess = function (game: Game, position: Point): Game {
    const opened = game.state[position.x][position.y];
    return update(game.state, (field: BoardField) => {
        if (field == opened) {
            return new BoardField(false, field.isBomb, field.bombs, !field.marked);
        } else {
            return new BoardField(field.isOpened, field.isBomb, field.bombs, field.marked);
        }
    });
}

export const checkCompleted = function (game: Game): boolean {
    const and = (a: boolean, b: boolean) => a && b;
    return game.state.map(row => {
        return row.map(field => {
            const ok = ((field.isBomb && field.marked) || (!field.isBomb && !field.marked && field.isOpened)) &&
                ((field.isOpened && !field.isBomb) || (!field.isOpened && field.isBomb));
                if(!ok)
            console.log('field', field);
            //console.log(ok);
            return ok;
        }).reduce(and);
    }).reduce(and);
}

export class BoardField {
    constructor(
        public isOpened = false,
        public isBomb = false,
        public bombs = 0,
        public marked = false,
    ) {
    }
}
