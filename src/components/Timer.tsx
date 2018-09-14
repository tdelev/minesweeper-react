import * as React from "react";
import { time } from '../timer';

export class Timer extends React.Component<TimerProps> {

    render() {
        return (
            <h3>{time.secondsToString(this.props.elapsedSeconds)}</h3>
        );
    }
}

export interface TimerProps {
    elapsedSeconds: number;
}

