import * as React from "react";
import { Mine, Point } from '../domain';

export class MineSquare extends React.Component<MineProps> {

    onRightClick(e: React.MouseEvent<HTMLButtonElement>) {
        this.props.onRightClick(this.props.field);
        e.preventDefault();
    }

    renderField(field: Mine) {
        if (field.isOpened) {
            if (field.bombs > 0) {
                return (<span className={`bombs-${field.bombs}`}>{field.bombs}</span>);
            } else if (field.bombs == 0) {
                return ''
            } else {
                return (<i className='fas fa-xs fa-bomb bomb'/>);
            }
        } else {
            if (field.isFlagged) {
                return (<i className='fas fa-xs fa-flag'/>);
            } else {
                return '';
            }
        }
    }

    render() {
        const field = this.props.field;
        return (
            <button className={field.isOpened ? ['mine-button', 'mine-opened'].join(' ') : 'mine-button'}
                    tabIndex={this.props.index}
                    onClick={() => this.props.onLeftClick(this.props.field)}
                    onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) => this.onRightClick(e)}>
                {this.renderField(field)}
            </button>
        );
    }
}


export interface MineProps {
    index: number;
    position: Point;
    field: Mine;
    onLeftClick: (field: Mine) => void;
    onRightClick: (field: Mine) => void;
}



