import * as React from 'react';
import './App.css';

import { Board } from './components/Board';
import { Point } from './components/Square';
import { newGame, onOpen, onGuess, checkCompleted, Game } from './Game';

class App extends React.Component<AppProps> {

  state = {
    game: newGame(this.props.rows, this.props.columns),
    completed: false
  }
  constructor(props: AppProps) {
    super(props);
  }

  updateState(position: Point, updateFn: (game: Game, position: Point) => Game) {
    this.setState((prevState: any, props) => {
      const updatedGame = updateFn(prevState.game, position);
      return {
        game: updatedGame,
        completed: checkCompleted(updatedGame)
      };
    });
  }

  public onSquareLeftClick(position: Point) {
    this.updateState(position, onOpen);
  }

  public onSquareRightClick(position: Point) {
    this.updateState(position, onGuess);
  }

  public render() {
    return (
      <div className="game">
        <Board
          game={this.state.game}
          onSquareLeftClick={(position) => this.onSquareLeftClick(position)}
          onSquareRightClick={(position) => this.onSquareRightClick(position)} />
        <div className='status'>Completed: {this.state.completed ? 'YES' : 'NO'}</div>
      </div>
    );
  }
}
export interface AppProps {
  rows: number;
  columns: number;
}
export default App;
