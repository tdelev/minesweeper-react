import * as React from 'react';
import './App.css';

import { MineField } from './components/MineField';
import { checkCompleted, Game, Mine, newGame, onExplore, onMark, onOpen } from './Game';
import { Timer } from './components/Timer';

class App extends React.Component<AppProps> {
    controlDown = false;
    shiftDown = false;
    startTime: Date;
    state = {
        game: newGame(this.props.rows, this.props.columns),
        completed: false,
        elapsedSeconds: 0
    };

    isControlKey(code: string) {
        return code === "ControlLeft" || code === "ControlRight";
    }

    isShiftKey(code: string) {
        return code === "ShiftLeft" || code === "ShiftRight";
    }

    timer: any;

    componentDidMount() {
        document.onkeydown = (e: KeyboardEvent) => {
            if (this.isControlKey(e.code)) {
                this.controlDown = true;
            }
            if (this.isShiftKey(e.code)) {
                this.shiftDown = true;
            }
        };
        document.onkeyup = (e: KeyboardEvent) => {
            if (this.isControlKey(e.code)) {
                this.controlDown = false;
            }
            if (this.isShiftKey(e.code)) {
                this.shiftDown = false;
            }
        };
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
            const completed = checkCompleted(updatedGame);
            if (completed || updatedGame.exploded) {
                clearInterval(this.timer);
            }
            return {
                game: updatedGame,
                completed: completed
            };
        });
    }

    public onSquareLeftClick(field: Mine) {
        if (this.controlDown) {
            this.updateState(field, onExplore);
        } else if (this.shiftDown) {
            this.updateState(field, onOpen);
        } else {
            this.updateState(field, onMark);
        }
    }

    public onSquareRightClick(field: Mine) {
        //this.updateState(field, onMark);
    }

    public render() {
        return (
            <div className="game">
                <MineField
                    game={this.state.game}
                    onLeftClick={(field: Mine) => this.onSquareLeftClick(field)}
                    onRightClick={(field: Mine) => this.onSquareRightClick(field)}/>
                <Timer elapsedSeconds={this.state.elapsedSeconds}/>
                <div className='status'>Completed: {this.state.completed ? 'YES' : 'NO'}</div>
                <div className='help'>
                    <h3>Help</h3>
                    <ol>
                        <li>Left Click to mark mine</li>
                        <li>Shift + Left Click to open mine</li>
                        <li>Ctrl + Left Click to explore fields</li>
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
