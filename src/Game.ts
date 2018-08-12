import { Point } from "./components/MineSquare";

export class Game {
    constructor(public state: Array<Array<Mine>>) {
    }
}

const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

export const newGame = function (rows: number, columns: number): Game {
    const state = Array(rows).fill(null).map((r, i: number) => {
        return Array(columns).fill(null).map((c, j: number) => {
            const isBomb = Math.random() < 0.2;
            return new Mine({x: i, y: j}, false, isBomb, 0);
        });
    });
    for (let i = 0; i < state.length; ++i) {
        for (let j = 0; j < state[i].length; ++j) {
            const field = state[i][j];
            if (field.isMine) {
                field.bombs = -1;
                for (let k = 0; k < dx.length; ++k) {
                    let ii = i + dx[k];
                    let jj = j + dy[k];
                    if (ii >= 0 && ii < state.length && jj >= 0 && jj < state[0].length) {
                        if (!state[ii][jj].isMine)
                            state[ii][jj].bombs += 1;
                    }
                }
            }
        }
    }
    return new Game(state);
};

function endGame(game: Game): Game {
    return update(game.state, (field) => {
        if (field.isMine) {
            return new Mine(field.position, true, field.isMine, field.bombs, field.isMarked);
        } else {
            return new Mine(field.position, field.isOpened, field.isMine, field.bombs, field.isMarked);
        }
    });
}

export const onOpen = function (game: Game, field: Mine): Game {
    if (field.isMarked) return game;
    if (field.isMine) {
        return endGame(game);
    } else {
        const openField = (openedField: Mine) => (field: Mine) => {
            if (field === openedField) {
                return new Mine(field.position, true, field.isMine, field.bombs, false);
            } else {
                return new Mine(field.position, field.isOpened, field.isMine, field.bombs, field.isMarked);
            }
        };
        let result = update(game.state, openField(field));
        if (field.bombs == 0) {
            updateZeros(result.state, field);
        }
        return result;
    }
};

export const onMark = function (game: Game, opened: Mine): Game {
    return update(game.state, (field: Mine) => {
        if (field == opened) {
            return new Mine(field.position, false, field.isMine, field.bombs, !field.isMarked);
        } else {
            return new Mine(field.position, field.isOpened, field.isMine, field.bombs, field.isMarked);
        }
    });
};

export const onExplore = function (game: Game, opened: Mine): Game {
    const updated = update(game.state, (field: Mine) => field);
    let hitMine = false;
    traverseNeighbours(updated.state, opened, field => {
        if (!field.isOpened && !field.isMarked) {
            if (field.isMine) {
                hitMine = true;
            } else {
                field.isOpened = true;
                if (field.bombs == 0) {
                    updateZeros(updated.state, field);
                }
            }
        }
    });
    if (hitMine) {
        return endGame(game);
    }
    return updated;
};

function traverseNeighbours(fields: Array<Array<Mine>>, startMine: Mine, onField: (field: Mine) => void) {
    const start = startMine.position;
    for (let i = 0; i < dx.length; ++i) {
        let ii = start.x + dx[i];
        let jj = start.y + dy[i];
        if (ii >= 0 && ii < fields.length && jj >= 0 && jj < fields[0].length) {
            onField(fields[ii][jj]);
        }
    }
}

function updateZeros(fields: Array<Array<Mine>>, start: Mine) {
    traverseNeighbours(fields, start, (field => {
        if (!field.isOpened && !field.isMine) {
            field.isOpened = true;
            if (field.bombs == 0) {
                updateZeros(fields, field);
            }
        }
    }));
}

function update(fields: Array<Array<Mine>>, f: ((b: Mine) => Mine)): Game {
    const updated = fields.slice().map(row => {
        return row.slice().map(field => {
            return f(field);
        });
    });
    return new Game(updated);
}


export const checkCompleted = function (game: Game): boolean {
    const and = (a: boolean, b: boolean) => a && b;
    return game.state.map(row => {
        return row.map(field => {
            return ((field.isMine && field.isMarked) || (!field.isMine && !field.isMarked && field.isOpened)) &&
                ((field.isOpened && !field.isMine) || (!field.isOpened && field.isMine));
        }).reduce(and);
    }).reduce(and);
};

export class Mine {
    constructor(
        public position: Point,
        public isOpened = false,
        public isMine = false,
        public bombs = 0,
        public isMarked = false,
    ) {
    }
}
