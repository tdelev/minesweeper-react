import { Game, Mine } from '../domain';
import { MineSquare } from './MineSquare';

export interface MineFieldProps {
  game: Game;
  onLeftClick: (field: Mine) => void;
  onExploreNeighbors: (field: Mine) => void;
}

export const MineField = ({ game, onLeftClick, onExploreNeighbors }: MineFieldProps) => {
  const gameOver = game.exploded;

  return (
    <div className="game-board">
      {game.state.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((field, colIndex) => (
            <MineSquare
              key={`${rowIndex}-${colIndex}`}
              index={colIndex + row.length * rowIndex}
              field={field}
              onLeftClick={onLeftClick}
              onExploreNeighbors={onExploreNeighbors}
              gameOver={gameOver}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
