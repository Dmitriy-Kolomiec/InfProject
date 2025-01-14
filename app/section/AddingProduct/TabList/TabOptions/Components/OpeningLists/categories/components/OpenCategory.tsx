import styles from './listOpenCategory.module.css';

interface IProps {
  name: string;
}

export const OpenCategory = ({ name }: IProps) => {
  return (
    <div className={styles.titleCategories}>
      <span>{name}</span>
    </div>
  );
};
