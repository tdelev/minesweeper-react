import * as React from 'react';
import './App.css';

import { MineField } from './components/MineField';
import { game } from './game';
import { Timer } from './components/Timer';
import { Game, Mine } from './domain';

class App extends React.Component<AppProps> {
    controlDown = false;
    startTime: Date;
    state = {
        rows: this.props.rows,
        columns: this.props.columns,
        game: game.newGame(this.props.rows, this.props.columns),
        completed: false,
        flagged: 0,
        elapsedSeconds: 0
    };

    isControlKey(code: string) {
        return code === "ControlLeft" || code === "ControlRight";
    }

    timer: any;

    componentDidMount() {
        document.onkeydown = (e: KeyboardEvent) => {
            if (this.isControlKey(e.code)) {
                this.controlDown = true;
            }
        };
        document.onkeyup = (e: KeyboardEvent) => {
            if (this.isControlKey(e.code)) {
                this.controlDown = false;
            }
        };
        this.startTimer();
    }

    startTimer() {
        this.startTime = new Date();
        this.timer = setInterval(() => {
            const now = new Date();
            const elapsedMs = now.getTime() - this.startTime.getTime();
            this.setState({
                elapsedSeconds: Math.floor(elapsedMs / 1000)
            });
        }, 1000);
    }

    updateState(field: Mine, updateFn: (game: Game, field: Mine) => Game) {
        this.setState((prevState: any, props) => {
            const updatedGame = updateFn(prevState.game, field);
            const completed = game.checkCompleted(updatedGame);
            if (completed || updatedGame.exploded) {
                clearInterval(this.timer);
            }
            return {
                game: updatedGame,
                completed: completed,
                flagged: game.countFlagged(updatedGame)
            };
        });
    }

    public onSquareLeftClick(field: Mine) {
        if (this.controlDown) {
            this.updateState(field, game.openMine);
        } else {
            this.updateState(field, game.markMine);
        }
    }

    startGame(rows: number, columns: number) {
        clearInterval(this.timer);
        this.startTimer();
        this.setState({
            rows: rows,
            columns: columns,
            game: game.newGame(rows, columns),
            completed: false,
            flagged: 0,
            elapsedSeconds: 0
        });
    }

    public render() {
        return (
            <div className="game">
                <div className="menu">
                    <ul className="level-menu">
                        <li onClick={(e) => this.startGame(6, 8)}>Easy</li>
                        <li onClick={(e) => this.startGame(10, 14)}>Medium</li>
                        <li onClick={(e) => this.startGame(20, 30)}>Hard</li>
                    </ul>
                </div>
                <MineField
                    game={this.state.game}
                    onLeftClick={(field: Mine) => this.onSquareLeftClick(field)}/>
                <Timer elapsedSeconds={this.state.elapsedSeconds}/>
                <div className='status'>Completed: {this.state.completed ? 'YES' : 'NO'}</div>
                <div className='status'>{this.state.flagged}/{this.state.game.totalBombs}</div>
                <div className='help'>
                    <h3>How to play</h3>
                    <ol>
                        <li>Left Click to mark possible mine or to explore fields around opened field</li>
                        <li>Ctrl + Left Click to open field</li>
                    </ol>
                </div>
            </div>
        );
    }
}

export interface AppProps {
    rows: number;
    columns: number;
}

export default App;
