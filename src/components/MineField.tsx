import { Game, Mine } from '../domain';
import { MineSquare } from './MineSquare';

export interface MineFieldProps {
  game: Game;
  onLeftClick: (field: Mine) => void;
}

export const MineField = ({ game, onLeftClick }: MineFieldProps) => (
  <div className="game-board">
    {game.state.map((row, i) => (
      <div key={i} className="board-row">
        {row.map((field, j) => (
          <MineSquare
            key={`${i}-${j}`}
            index={j + row.length}
            field={field}
            onLeftClick={onLeftClick}
          />
        ))}
      </div>
    ))}
  </div>
);
