import { Game, Mine, Point } from './domain';

const BOMBS_PROBABILITY = 0.15;

const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

function newGame(rows: number, columns: number): Game {
    let totalMines = 0;
    let estimatedMines = Math.floor(rows * columns * BOMBS_PROBABILITY);
    const state = Array(rows).fill(null).map((r, i: number) => {
        return Array(columns).fill(null).map((c, j: number) => {
            const isMine = Math.random() < BOMBS_PROBABILITY;
            if (isMine) {
                totalMines += 1;
                return new Mine({x: i, y: j}, false, -1, false);
            } else {
                return new Mine({x: i, y: j}, false, 0, false);
            }
        });
    });
    while (totalMines < estimatedMines) {
        const randX = Math.floor(Math.random() * rows);
        const randY = Math.floor(Math.random() * columns);
        if (!isMine(state[randX][randY])) {
            ++totalMines;
            state[randX][randY].bombs = -1;
        }
    }
    if (totalMines > estimatedMines) {
        const mines = state.map(row => row.filter(mine => !isMine(mine)))
            .reduce((prev, current) => prev.concat(current));

        while (totalMines > estimatedMines) {
            const randMineIndex = Math.floor(Math.random() * mines.length);
            mines[randMineIndex].bombs = 0;
            --totalMines;
        }
    }
    fillBombsCount(state);

    return new Game(state, totalMines);
}

function fillBombsCount(state: Array<Array<Mine>>) {
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
}

function endGame(game: Game): Game {
    return update(game, (field) => {
        if (isMine(field)) {
            return new Mine(field.position, true, field.bombs, field.isFlagged);
        } else {
            return new Mine(field.position, field.isOpened, field.bombs, field.isFlagged);
        }
    }, true);
}

function openMine(game: Game, field: Mine): Game {
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
        let result = update(game, openField(field));
        if (field.bombs == 0) {
            updateZeros(result.state, field);
        }
        return result;
    }
}

function exploreOpenedField(game: Game, opened: Mine): Game {
    const updated = update(game, (field: Mine) => field);
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
}

function markMine(game: Game, opened: Mine): Game {
    if (opened.isOpened && !opened.isFlagged) return exploreOpenedField(game, opened);
    return update(game, (field: Mine) => {
        if (field == opened) {
            return new Mine(field.position, false, field.bombs, !field.isFlagged);
        } else {
            return new Mine(field.position, field.isOpened, field.bombs, field.isFlagged);
        }
    });
}

function traverseNeighbours(fields: Array<Array<Mine>>, startMine: Mine, onField: (field: Mine) => Mine) {
    let inBounds = (point: Point) => point.x >= 0 && point.x < fields.length &&
        point.y >= 0 && point.y < fields[0].length;
    const start = startMine.position;
    dx.map((x, i) => ({dx: x, dy: dy[i]}))
        .map(deltas => ({x: start.x + deltas.dx, y: start.y + deltas.dy}))
        .filter((point: Point) => inBounds(point))
        .map((point: Point) => onField(fields[point.x][point.y]));
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

function update(game: Game, f: ((b: Mine) => Mine), exploded = false): Game {
    const updated = game.state.slice().map(row => {
        return row.slice().map(field => {
            return f(field);
        });
    });
    return new Game(updated, game.totalBombs, game.exploded || exploded);
}

function isMineCovered(field: Mine) {
    if (isMine(field)) {
        return field.isFlagged;
    } else {
        return field.isOpened;
    }
}

function checkCompleted(game: Game): boolean {
    const and = (a: boolean, b: boolean) => a && b;
    return game.state.map(row => {
        return row.map(field => {
            return isMineCovered(field);
        }).reduce(and);
    }).reduce(and);
}

function countFlagged(game: Game): number {
    const plus = (a: number, b: number) => a + b;
    return game.state.map(row => {
        return row.map(field => {
            return field.isFlagged ? 1 : 0;
        }).reduce(plus, 0);
    }).reduce(plus, 0);
}

function isMine(mine: Mine) {
    return mine.bombs === -1;
}

export const game = {
    newGame: newGame,
    fillBombsCount: fillBombsCount,
    countFlagged: countFlagged,
    checkCompleted: checkCompleted,
    markMine: markMine,
    openMine: openMine,
    BOMBS_PROBABILITY: BOMBS_PROBABILITY
};