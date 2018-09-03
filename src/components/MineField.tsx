import * as React from "react";
import { MineSquare } from "./MineSquare";
import { Game, Mine } from "../domain";

export class MineField extends React.Component<MineFieldProps> {

    render() {
        return (
            <div className="game-board">
                {
                    this.props.game.state.map((row, i) => {
                        return (
                            <div key={i} className="board-row">
                                {
                                    row.map((field, j) => {
                                        return (
                                            <MineSquare key={`${i}-${j}`}
                                                        index={j + row.length}
                                                        field={field}
                                                        position={{ x: i, y: j }}
                                                        onLeftClick={(field) => this.props.onLeftClick(field)}
                                                        onRightClick={(field) => this.props.onRightClick(field)}/>
                                        );
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}


export interface MineFieldProps {
    game: Game;
    onLeftClick: (field: Mine) => void;
    onRightClick: (field: Mine) => void;
}
