import * as React from "react";
import { MineSquare } from "./MineSquare";
import { Game, Mine } from "../domain";

export const MineField = (props: MineFieldProps) => (
    <div className="game-board">
        {
            props.game.state.map((row, i) => (
                    <div key={i} className="board-row">
                        {
                            row.map((field, j) => (
                                    <MineSquare key={`${i}-${j}`}
                                                index={j + row.length}
                                                field={field}
                                                onLeftClick={(field) => props.onLeftClick(field)}/>
                                )
                            )
                        }
                    </div>
                )
            )
        }
    </div>
);

export interface MineFieldProps {
    game: Game;
    onLeftClick: (field: Mine) => void;
}
