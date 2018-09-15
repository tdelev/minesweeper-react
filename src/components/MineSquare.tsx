import * as React from "react";
import { Mine } from '../domain';

export const MineSquare = (props: MineProps) => {
    const field = props.field;
    return (
        <button className={'mine-button' + (field.isOpened ? '' : ' mine-opened')}
                tabIndex={props.index}
                onClick={() => props.onLeftClick(field)}>
            {renderField(field)}
        </button>
    );
};

function renderField(field: Mine) {
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

export interface MineProps {
    index: number;
    field: Mine;
    onLeftClick: (field: Mine) => void;
}
