import * as React from 'react';
import './App.css';

import { MineField } from './components/MineField';
import { checkCompleted, Game, Mine, newGame, onExplore, onMark, onOpen } from './Game';

class App extends React.Component<AppProps> {
    controlDown = false;
    state = {
        game: newGame(this.props.rows, this.props.columns),
        completed: false
    };

    isControlKey(code: string) {
        return code === "ControlLeft" || code === "ControlRight";
    }

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
    }

    updateState(field: Mine, updateFn: (game: Game, field: Mine) => Game) {
        this.setState((prevState: any, props) => {
            const updatedGame = updateFn(prevState.game, field);
            return {
                game: updatedGame,
                completed: checkCompleted(updatedGame)
            };
        });
    }

    public onSquareLeftClick(field: Mine) {
        console.log('left click');
        if (this.controlDown) {
            this.updateState(field, onExplore);
        } else {
            this.updateState(field, onOpen);
        }
    }

    public onSquareRightClick(field: Mine) {
        console.log('right click');
        this.updateState(field, onMark);
    }

    public render() {
        return (
            <div className="game">
                <MineField
                    game={this.state.game}
                    onLeftClick={(field: Mine) => this.onSquareLeftClick(field)}
                    onRightClick={(field: Mine) => this.onSquareRightClick(field)}/>
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
