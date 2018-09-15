import * as React from "react";
import { time } from '../timer';

export const Timer = (props: TimerProps) => (
    <h3>{time.secondsToString(props.elapsedSeconds)}</h3>
);

export interface TimerProps {
    elapsedSeconds: number;
}

