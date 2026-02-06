import { useState, useEffect, useCallback, useRef } from 'react';
import { MineField } from './components/MineField';
import { game as gameEngine } from './game';
import { StatusDashboard } from './components/StatusDashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { Game, Mine } from './domain';

import './styles/variables.css';
import './styles/components.css';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const DIFFICULTY_CONFIG: Record<Difficulty, { rows: number; columns: number }> = {
  Easy: { rows: 6, columns: 8 },
  Medium: { rows: 10, columns: 14 },
  Hard: { rows: 20, columns: 30 },
};

function getDifficultyFromURL(): Difficulty {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  if (mode === 'Easy' || mode === 'Medium' || mode === 'Hard') {
    return mode;
  }
  return 'Medium';
}

function updateURL(difficulty: Difficulty) {
  const url = new URL(window.location.href);
  url.searchParams.set('mode', difficulty);
  window.history.replaceState({}, '', url.toString());
}

function App() {
  const initialDifficulty = getDifficultyFromURL();
  const initialConfig = DIFFICULTY_CONFIG[initialDifficulty];
  
  const [game, setGame] = useState<Game>(() => gameEngine.newGame(initialConfig.rows, initialConfig.columns));
  const [completed, setCompleted] = useState(false);
  const [flaggedCount, setFlaggedCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [controlDown, setControlDown] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(initialDifficulty);
  
  const startTimeRef = useRef<Date>(new Date());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isControlKey = useCallback((code: string): boolean => {
    return code === "ControlLeft" || code === "ControlRight";
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = new Date();
    timerRef.current = setInterval(() => {
      const now = new Date();
      const elapsedMs = now.getTime() - startTimeRef.current.getTime();
      setElapsedSeconds(Math.floor(elapsedMs / 1000));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isControlKey(e.code)) {
        setControlDown(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isControlKey(e.code)) {
        setControlDown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    startTimer();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      stopTimer();
    };
  }, [isControlKey, startTimer, stopTimer]);

  const updateState = useCallback((field: Mine, updateFn: (game: Game, field: Mine) => Game) => {
    setGame(prevGame => {
      const updatedGame = updateFn(prevGame, field);
      const isCompleted = gameEngine.checkCompleted(updatedGame);
      if (isCompleted || updatedGame.exploded) {
        stopTimer();
      }
      setCompleted(isCompleted);
      setFlaggedCount(gameEngine.countFlagged(updatedGame));
      return updatedGame;
    });
  }, [stopTimer]);

  const onSquareLeftClick = useCallback((field: Mine) => {
    if (controlDown) {
      updateState(field, gameEngine.openMine);
    } else {
      updateState(field, gameEngine.markMine);
    }
  }, [controlDown, updateState]);

  const onExploreNeighbors = useCallback((field: Mine) => {
    // Explore neighbors when clicking on a revealed square with a number
    if (field.isOpened && field.bombs > 0) {
      updateState(field, gameEngine.exploreOpenedField);
    }
  }, [updateState]);

  const startGame = useCallback((difficulty: Difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    stopTimer();
    startTimer();
    setGame(gameEngine.newGame(config.rows, config.columns));
    setCompleted(false);
    setFlaggedCount(0);
    setElapsedSeconds(0);
    setCurrentDifficulty(difficulty);
    updateURL(difficulty);
  }, [startTimer, stopTimer]);

  const getGameStatus = () => {
    if (completed) return { message: '🎉 Victory! All mines cleared!', className: 'win' };
    if (game.exploded) return { message: '💥 Game Over! You hit a mine!', className: 'lose' };
    return null;
  };

  const status = getGameStatus();

  return (
    <div className="game-container">
      <ThemeToggle />
      
      <header className="game-header">
        <h1 className="game-title">Minesweeper</h1>
        <p className="game-subtitle">Cyberpunk Edition</p>
      </header>

      <nav className="game-menu">
        <ul className="level-selector">
          <li>
            <button 
              className={`level-button ${currentDifficulty === 'Easy' ? 'active' : ''}`} 
              onClick={() => startGame('Easy')}
            >
              Easy
            </button>
          </li>
          <li>
            <button 
              className={`level-button ${currentDifficulty === 'Medium' ? 'active' : ''}`} 
              onClick={() => startGame('Medium')}
            >
              Medium
            </button>
          </li>
          <li>
            <button 
              className={`level-button ${currentDifficulty === 'Hard' ? 'active' : ''}`} 
              onClick={() => startGame('Hard')}
            >
              Hard
            </button>
          </li>
        </ul>
      </nav>

      <main className="game-board-container">
        <StatusDashboard 
          flaggedCount={flaggedCount}
          totalBombs={game.totalBombs}
          elapsedSeconds={elapsedSeconds}
          completed={completed}
          exploded={game.exploded}
        />
        
        <MineField
          game={game}
          onLeftClick={onSquareLeftClick}
          onExploreNeighbors={onExploreNeighbors}
        />

        {status && (
          <div className={`game-status ${status.className}`}>
            {status.message}
          </div>
        )}
      </main>

      <section className="instructions">
        <h3>How to Play</h3>
        <ol>
          <li><strong>Left Click</strong> a hidden square to flag it as a potential mine</li>
          <li><strong>Ctrl + Left Click</strong> to open a square and reveal what&apos;s underneath</li>
          <li><strong>Click</strong> a revealed number to open all adjacent unopened squares</li>
          <li><strong>Numbers</strong> indicate how many mines are adjacent to that square</li>
          <li><strong>Goal:</strong> Flag all mines without triggering any explosions!</li>
        </ol>
      </section>
    </div>
  );
}

export default App;
