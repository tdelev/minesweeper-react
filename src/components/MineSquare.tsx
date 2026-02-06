import { Mine } from '../domain';

export interface MineProps {
  index: number;
  field: Mine;
  onLeftClick: (field: Mine) => void;
}

function renderField(field: Mine) {
  if (field.isOpened) {
    if (field.bombs > 0) {
      return <span className={`bombs-${field.bombs}`}>{field.bombs}</span>;
    } else if (field.bombs === 0) {
      return '';
    } else {
      return <i className='fas fa-xs fa-bomb bomb' />;
    }
  } else {
    if (field.isFlagged) {
      return <i className='fas fa-xs fa-flag' />;
    } else {
      return '';
    }
  }
}

export const MineSquare = ({ index, field, onLeftClick }: MineProps) => {
  return (
    <button
      className={'mine-button' + (field.isOpened ? '' : ' mine-opened')}
      tabIndex={index}
      onClick={() => onLeftClick(field)}
    >
      {renderField(field)}
    </button>
  );
};
