import { Mine } from '../domain';
import { useState, useEffect } from 'react';

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
  }
  return '';
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
  const [isFlagged, setIsFlagged] = useState(field.isFlagged);
  const [isRevealed, setIsRevealed] = useState(field.isOpened);

  // Sync with field state when it changes externally
  useEffect(() => {
    setIsFlagged(field.isFlagged);
    setIsRevealed(field.isOpened);
  }, [field.isFlagged, field.isOpened]);

  const handleClick = () => {
    if (gameOver) return;
    
    // If field is revealed and has a number, explore neighbors
    if (isRevealed && field.bombs > 0) {
      onExploreNeighbors(field);
    } else if (!isRevealed) {
      // Normal click on hidden field
      onLeftClick(field);
    }
  };

  const getClassNames = () => {
    const classes = ['mine-square'];
    if (isRevealed) classes.push('revealed');
    if (isFlagged) classes.push('flagged');
    if (field.bombs === -1 && isRevealed) classes.push('exploded');
    return classes.join(' ');
  };

  return (
    <div
      className={getClassNames()}
      tabIndex={index}
      onClick={handleClick}
      role="button"
      aria-label={isRevealed 
        ? field.bombs === -1 ? 'Bomb' : `${field.bombs} adjacent mines`
        : isFlagged ? 'Flagged' : 'Hidden'
      }
      aria-disabled={gameOver}
    >
      {renderFieldContent(field)}
    </div>
  );
};
