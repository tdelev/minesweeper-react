import * as React from "react";
import { BoardField } from "../Game";

export class Square extends React.Component<SqureProps> {

    onRightClick(e: React.MouseEvent<HTMLButtonElement>) {
        this.props.onSquareRightClick(this.props.position);
        e.preventDefault();
    }

    renderField(field: BoardField) {
        if(field.isOpened) {
            if(field.bombs > 0) {
                return `${field.bombs}`;
            } else if(field.bombs == 0) {
                return ''
            } return '*';
        } else {
            if(field.marked) {
                return 'x'
            } else {
                return '';
            }
        }
    }

    render() {
        const field = this.props.field;
        return (
            <button className={field.isOpened ? ['mine-button','mine-opened'].join(' ') : 'mine-button'}
                onClick={() => this.props.onSquareLeftClick(this.props.position)}
                onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) => this.onRightClick(e)}>
                {this.renderField(field)}
            </button>
        );
    }
}


export interface SqureProps {
    position: Point;
    field: BoardField;
    onSquareLeftClick: (position: Point) => void;
    onSquareRightClick: (position: Point) => void;
}

export interface Point {
    x: number;
    y: number;
}

export enum SquareValue {
    BOMB,
    EMPTY
}
