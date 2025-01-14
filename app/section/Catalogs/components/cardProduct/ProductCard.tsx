import styles from './productCard.module.css';
import { formatPrice } from '@/data/utils.common';
import { IPublicProduct } from '@/interface/publicPart/publicPart.interface';
import { APP_PATHS } from '@/data/paths.data';
import { useRouter } from 'next/navigation';
import DefaultImage from '@/public/defaultImage.svg';
import Image from 'next/image';
import { API_SERVER_FILES } from '@/data/env';

interface IProps {
  product: IPublicProduct;
}

export const ProductCard = ({ product }: IProps) => {
  const router = useRouter();
  const minPrice = product.data.reduce(
    (min, item) => Math.min(min, item.stockBalance.price),
    product.data[0].stockBalance.price,
  );

  return (
    <li
      onClick={() => router.push(APP_PATHS.PUBLIC_PRODUCT(product.id))}
      className={styles.container}
      itemScope
      itemProp="itemListElement"
      itemType="http://schema.org/Product"
    >
      <div className={styles.name} itemProp="name">
        {product.name}
      </div>
      <div className={styles.image}>
        {!!product.picture.path ? (
          <Image
            src={`${API_SERVER_FILES}/files${product.picture.path}`}
            width="226"
            height="226"
            alt="image"
            priority
            itemProp="image"
          />
        ) : (
          <DefaultImage />
        )}
      </div>
      <div className={styles.price} itemProp="price">
        от {formatPrice(minPrice)} &#8381;
      </div>
      <meta itemProp="priceCurrency" content="RUB" />
    </li>
  );
};
