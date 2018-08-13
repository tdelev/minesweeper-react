import * as React from "react";

export class Timer extends React.Component<TimerProps> {

    leadZero(num: number) {
        return num < 10 ? `0${num}` : `${num}`;
    }

    renderTime(seconds: number) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${this.leadZero(min)}:${this.leadZero(sec)}`;
    }

    render() {
        return (
            <h3>{this.renderTime(this.props.elapsedSeconds)}</h3>
        );
    }
}


export interface TimerProps {
    elapsedSeconds: number;
}

