import { ICategory } from '@/interface/addingProduct/options.interface';
import styles from './listOpenCategory.module.css';
import { OpenCategory } from './OpenCategory';

interface IProps {
  categories: ICategory[];
  id: string;
}

export default function ListOpenCategory({ categories }: IProps) {
  return (
    <>
      {categories?.map(category => {
        return (
          <div key={category.id} className={styles.titleCategories}>
            <OpenCategory {...category} />
          </div>
        );
      })}
    </>
  );
}
