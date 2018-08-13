import { Point } from "./components/MineSquare";

export class Game {
    constructor(public state: Array<Array<Mine>>, public exploded = false) {
    }
}

const BOMBS_PROBABILITY = 0.15;

const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

export const newGame = function (rows: number, columns: number): Game {
    const state = Array(rows).fill(null).map((r, i: number) => {
        return Array(columns).fill(null).map((c, j: number) => {
            const isBomb = Math.random() < BOMBS_PROBABILITY;
            return new Mine({ x: i, y: j }, false, isBomb ? -1 : 0, false);
        });
    });
    state.forEach((row, i) => {
        row.forEach((mine, j) => {
            if (isMine(mine)) {
                mine.bombs = -1;
                traverseNeighbours(state, mine, nf => {
                    if (!isMine(nf)) {
                        nf.bombs += 1;
                    }
                    return nf;
                });
            }
        });
    });
    return new Game(state);
};

function endGame(game: Game): Game {
    return update(game.state, (field) => {
        if (isMine(field)) {
            return new Mine(field.position, true, field.bombs, field.isFlagged);
        } else {
            return new Mine(field.position, field.isOpened, field.bombs, field.isFlagged);
        }
    }, true);
}

export const onOpen = function (game: Game, field: Mine): Game {
    if (field.isFlagged) return game;
    else if (isMine(field)) {
        return endGame(game);
    } else {
        const openField = (openedField: Mine) => (field: Mine) => {
            if (field === openedField) {
                return new Mine(field.position, true, field.bombs, false);
            } else {
                return new Mine(field.position, field.isOpened, field.bombs, field.isFlagged);
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
    if (opened.isOpened && !opened.isFlagged) return onExplore(game, opened);
    return update(game.state, (field: Mine) => {
        if (field == opened) {
            return new Mine(field.position, false, field.bombs, !field.isFlagged);
        } else {
            return new Mine(field.position, field.isOpened, field.bombs, field.isFlagged);
        }
    });
};

const onExplore = function (game: Game, opened: Mine): Game {
    const updated = update(game.state, (field: Mine) => field);
    let hitMine = false;
    traverseNeighbours(updated.state, opened, field => {
        if (!field.isOpened && !field.isFlagged) {
            if (isMine(field)) {
                hitMine = true;
            } else {
                field.isOpened = true;
                if (field.bombs == 0) {
                    updateZeros(updated.state, field);
                }
            }
        }
        return field;
    });
    if (hitMine) {
        return endGame(game);
    }
    return updated;
};

function traverseNeighbours(fields: Array<Array<Mine>>, startMine: Mine, onField: (field: Mine) => Mine) {
    const start = startMine.position;
    dx.map((x, i) => [x, dy[i]])
        .map(deltas => [start.x + deltas[0], start.y + deltas[1]])
        .filter(indexes => indexes[0] >= 0 && indexes[0] < fields.length && indexes[1] >= 0 && indexes[1] < fields[0].length)
        .map(indexes => onField(fields[indexes[0]][indexes[1]]));
    /*for (let i = 0; i < dx.length; ++i) {
        let ii = start.x + dx[i];
        let jj = start.y + dy[i];
        if (ii >= 0 && ii < fields.length && jj >= 0 && jj < fields[0].length) {
            onField(fields[ii][jj]);
        }
    }*/
}

function updateZeros(fields: Array<Array<Mine>>, start: Mine) {
    traverseNeighbours(fields, start, (field => {
        if (!field.isOpened && !isMine(field)) {
            field.isOpened = true;
            if (field.bombs == 0) {
                updateZeros(fields, field);
            }
        }
        return field;
    }));
}

function update(fields: Array<Array<Mine>>, f: ((b: Mine) => Mine), exploded = false): Game {
    const updated = fields.slice().map(row => {
        return row.slice().map(field => {
            return f(field);
        });
    });
    return new Game(updated, exploded);
}


export const checkCompleted = function (game: Game): boolean {
    const and = (a: boolean, b: boolean) => a && b;
    return game.state.map(row => {
        return row.map(field => {
            return ((isMine(field) && field.isFlagged) || (!isMine(field) && !field.isFlagged && field.isOpened)) &&
                ((field.isOpened && !isMine(field)) || (!field.isOpened && isMine(field)));
        }).reduce(and);
    }).reduce(and);
};

export class Mine {
    constructor(
        public position: Point,
        public isOpened = false,
        public bombs = 0,
        public isFlagged = false,
    ) {
    }
}

function isMine(mine: Mine) {
    return mine.bombs === -1;
}
