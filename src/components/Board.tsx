import * as React from "react";
import { Square, Point } from "./Square";
import { Game } from "../Game";

export class Board extends React.Component<BoardProps> {

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
                                            <Square key={`${i}-${j}`}
                                                field={field}
                                                position={{ x: i, y: j }} 
                                                onSquareLeftClick={(position) => this.props.onSquareLeftClick(position)}
                                                onSquareRightClick={(position) => this.props.onSquareRightClick(position)} />
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


export interface BoardProps {
    game: Game;
    onSquareLeftClick: (position: Point) => void;
    onSquareRightClick: (position: Point) => void;
}
