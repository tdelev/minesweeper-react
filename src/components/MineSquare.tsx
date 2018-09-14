import * as React from "react";
import { Mine } from '../domain';

export class MineSquare extends React.Component<MineProps> {

    renderField(field: Mine) {
        if (field.isOpened) {
            if (field.mines > 0) {
                return (<span className={`bombs-${field.mines}`}>{field.mines}</span>);
            } else if (field.mines == 0) {
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
            <button className={'mine-button' + (field.isOpened ? '' : ' mine-opened')}
                    tabIndex={this.props.index}
                    onClick={() => this.props.onLeftClick(field)}>
                {this.renderField(field)}
            </button>
        );
    }
}

export interface MineProps {
    index: number;
    field: Mine;
    onLeftClick: (field: Mine) => void;
}



