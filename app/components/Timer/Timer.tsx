import React, { useEffect, useState } from 'react';
interface IProps {
  initialSeconds: number;
  onTimerEnd: () => void;
}

const Timer = ({ initialSeconds, onTimerEnd }: IProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      onTimerEnd();
    }
  }, [seconds, onTimerEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return <span style={{ paddingLeft: '5px' }}>{formatTime(seconds)}</span>;
};

export default Timer;
