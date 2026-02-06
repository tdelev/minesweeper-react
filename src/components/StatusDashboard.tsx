export interface StatusDashboardProps {
  flaggedCount: number;
  totalBombs: number;
  elapsedSeconds: number;
  completed: boolean;
  exploded: boolean;
}

export const StatusDashboard = ({ 
  flaggedCount, 
  totalBombs, 
  elapsedSeconds, 
  completed,
  exploded 
}: StatusDashboardProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="status-dashboard">
      <div className="status-item">
        <span className="status-label">Time</span>
        <span className="status-value status-value--timer">{formatTime(elapsedSeconds)}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Mines</span>
        <span className="status-value status-value--bombs">
          {flaggedCount}/{totalBombs}
        </span>
      </div>
      <div className="status-item">
        <span className="status-label">Status</span>
        <span className={`status-value status-value--completed ${completed ? 'completed' : ''}`}>
          {completed ? '✓ Won' : exploded ? '✗ Lost' : 'Playing'}
        </span>
      </div>
    </div>
  );
};
