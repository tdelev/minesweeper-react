import { time } from '../timer';

export interface TimerProps {
  elapsedSeconds: number;
}

export const Timer = ({ elapsedSeconds }: TimerProps) => (
  <h3>{time.secondsToString(elapsedSeconds)}</h3>
);
