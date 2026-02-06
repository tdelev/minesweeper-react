import { Mine } from '../domain';

export interface MineSquareProps {
  index: number;
  field: Mine;
  onLeftClick: (field: Mine) => void;
  onExploreNeighbors: (field: Mine) => void;
  gameOver: boolean;
}

function getNumberColorClass(bombs: number): string {
  if (bombs >= 1 && bombs <= 8) {
    return `mine-count-${bombs}`;
  } else {
    return '';
  }
}

function renderFieldContent(field: Mine) {
  if (field.isOpened) {
    if (field.bombs > 0) {
      return (
        <span className={getNumberColorClass(field.bombs)}>
          {field.bombs}
        </span>
      );
    } else if (field.bombs === 0) {
      return null;
    } else {
      // It's a bomb
      return <i className="fas fa-bomb" />;
    }
  } else {
    if (field.isFlagged) {
      return <i className="fas fa-flag" />;
    }
    return null;
  }
}

export const MineSquare = ({ index, field, onLeftClick, onExploreNeighbors, gameOver }: MineSquareProps) => {
  const handleClick = () => {
    if (gameOver) {
      return;
    } else if (field.isOpened && field.bombs > 0) {
      // If field is revealed and has a number, explore neighbors
      onExploreNeighbors(field);
    } else if (!field.isOpened) {
      // Normal click on hidden field
      onLeftClick(field);
    }
  };

  const getClassNames = () => {
    const classes = ['mine-square'];
    if (field.isOpened) {
      classes.push('revealed');
    }
    if (field.isFlagged) {
      classes.push('flagged');
    }
    if (field.bombs === -1 && field.isOpened) {
      classes.push('exploded');
    }
    return classes.join(' ');
  };

  return (
    <div
      className={getClassNames()}
      tabIndex={index}
      onClick={handleClick}
      role="button"
      aria-label={field.isOpened
        ? field.bombs === -1 ? 'Bomb' : `${field.bombs} adjacent mines`
        : field.isFlagged ? 'Flagged' : 'Hidden'
      }
      aria-disabled={gameOver}
    >
      {renderFieldContent(field)}
    </div>
  );
};
