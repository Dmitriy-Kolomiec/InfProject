import classNames from 'classnames';
import styles from './labelTitle.module.css';
import { LabelTitleProps } from './labelTitle.props';

export default function LabelTitle({ text, className }: LabelTitleProps) {
  return (
    <span className={classNames([className, styles.labelTitle])}>{text}</span>
  );
}
