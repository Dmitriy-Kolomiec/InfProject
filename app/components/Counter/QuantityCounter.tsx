import { Button, Input } from 'antd';
import styles from './QuantityCounter.module.css';
import { QuantityCounterProps } from './QuantityCounter.props';
import classNames from 'classnames';
import PlusIcon from '@/public/plus.svg';
import MinusIcon from '@/public/minus.svg';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function QuantityCounter({
  count,
  setCount,
  disabledUp,
  className,
  ...props
}: QuantityCounterProps) {
  const [inputValue, setInputValue] = useState<number>(count);

  const updateCountDebounced = useDebouncedCallback((value: number) => {
    setCount(value);
  }, 800);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);

    if (!isNaN(newValue) && (!disabledUp || newValue <= disabledUp)) {
      setInputValue(newValue);
    }
  };

  const handleInputBlur = () => {
    setCount(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCount(inputValue);
    }
  };

  const increaseCounter = () => {
    const newValue = inputValue + 1;
    if (!disabledUp || newValue <= disabledUp) {
      setInputValue(newValue);
      updateCountDebounced(newValue);
    }
  };

  const decreaseCounter = () => {
    const newValue = inputValue - 1;
    setInputValue(newValue);
    updateCountDebounced(newValue);
  };

  return (
    <div
      className={classNames([styles.counterContainer, className])}
      {...props}
    >
      <Button
        className={styles.button}
        onClick={decreaseCounter}
        disabled={inputValue <= 0}
      >
        <MinusIcon />
      </Button>
      <Input
        className={styles.input}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        style={{
          width: `${Math.min(
            Math.max(String(inputValue).length * 10, 18),
            66,
          )}px`,
        }}
      />
      <Button
        className={styles.button}
        onClick={increaseCounter}
        disabled={!!disabledUp && inputValue >= disabledUp}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
