import { Game, Mine } from './domain';

const BOMBS_PROBABILITY = 0.15;

const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
const dy = [-1, -1, -1, 0, 0, 1, 1, 1];

function newGame(rows: number, columns: number): Game {
    let totalBombs = 0;
    let estimatedBombs = Math.floor(rows * columns * BOMBS_PROBABILITY);
    const state = Array(rows).fill(null).map((_, i: number) => {
        return Array(columns).fill(null).map((_, j: number) => {
            const isBomb = Math.random() < BOMBS_PROBABILITY;
            if (isBomb && totalBombs < estimatedBombs) {
                totalBombs += 1;
                return new Mine({ x: i, y: j }, false, -1, false);
            } else {
                return new Mine({ x: i, y: j }, false, 0, false);
            }
        });
    });
    if (totalBombs < estimatedBombs) {
        return newGame(rows, columns);
    }
    fillBombsCount(state);
    return new Game(state, totalBombs);
}

function fillBombsCount(state: Array<Array<Mine>>) {
    state.forEach((row, _) => {
        row.forEach((mine, _) => {
            if (isMine(mine)) {
                traverseNeighbours(state, mine, mineNeighbour => {
                    if (!isMine(mineNeighbour)) {
                        mineNeighbour.bombs += 1;
                    }
                    return mineNeighbour;
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

function markMine(game: Game, opened: Mine): Game {
    if (opened.isOpened && !opened.isFlagged) return exploreMine(game, opened);
    return update(game, (field: Mine) => {
        if (field == opened) {
            return new Mine(field.position, false, field.bombs, !field.isFlagged);
        } else {
            return new Mine(field.position, field.isOpened, field.bombs, field.isFlagged);
        }
    });
}

function exploreMine(game: Game, opened: Mine): Game {
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

function update(game: Game, f: ((b: Mine) => Mine), exploded = false): Game {
    const updated = game.state.slice().map(row => {
        return row.slice().map(field => {
            return f(field);
        });
    });
    return new Game(updated, game.totalBombs, game.exploded || exploded);
}

function isMineProcessed(field: Mine) {
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
            return isMineProcessed(field);
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