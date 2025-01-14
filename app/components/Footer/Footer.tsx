import React from 'react';
import styles from './footer.module.css';
import { format } from 'date-fns';

export default function Footer(): React.ReactElement {
  // const categories: ITypesCategories[] = [
  //   { id: '1', name: 'Легковые (отечественные)' },
  //   { id: '2', name: 'Легковые (иномарки)' },
  //   { id: '3', name: 'Грузовые (отечественные)' },
  //   { id: '4', name: 'Грузовые (иномарки)' },
  //   { id: '5', name: 'Автобусы' },
  //   { id: '6', name: 'Спецтехника (отечественные)' },
  //   { id: '7', name: 'Спецтехника (иномарки)' },
  //   { id: '8', name: 'Двигатели' },
  //   { id: '9', name: 'Мототехника' },
  //   { id: '10', name: 'Автокосметика, краски, средства по уходу' },
  //   { id: '11', name: 'Автохимия, смазки, присадки' },
  //   { id: '12', name: 'Гаражное оборудование' },
  //   { id: '13', name: 'Пневмоинструмент' },
  //   { id: '14', name: 'Слесарный инструмент' },
  // ];

  // const info: ITypesCategories[] = [
  //   { id: '1', name: 'Оплата' },
  //   { id: '2', name: 'Доставка' },
  //   { id: '3', name: 'Возврат/обмен' },
  //   { id: '4', name: 'Документы' },
  //   { id: '5', name: 'О компании' },
  //   { id: '6', name: 'Контакты' },
  // ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        Inf.market&nbsp;
        {format(new Date(), 'yyyy')} (С) Все права защищены.
      </div>
      {/* <div className={styles.info}>
          <Title tag="h3">Inf.market</Title>
          <p>
          Программный комплекс, который предназначен для поиска товаров и
          заключения договора поставки между Поставщиком и Покупателем.
          </p>
          </div>
          <div className={styles.info}>
          <Title tag="h3">Безналичный расчет для юридических лиц</Title>
          <p>
          Оплатите заказ с расчетного счета организации, указав способ оплаты
          юридическое лицо/оплата по счету и заполнив нужные поля (для
          индивидуального предпринимателя — с расчётного счёта, открытого
          именно на имя индивидуального предпринимателя, а не с личного счёта
          физического лица).
          </p>
          </div>
          <div className={styles.footer}>
          <div className={styles.listCategories}>
          {categories.map(category => (
            <Link href="/" key={category.id} className={styles.item}>
                {category.name}
              </Link>
            ))}
          </div>
          <div className={styles.aboutCompmany}>
            {info.map(items => (
              <Link href="/" key={items.id} className={styles.item}>
                {items.name}
              </Link>
            ))}
          </div>
          <ul className={styles.contactsCompany}>
            <li>
              <a className={styles.linkContact} href="tel:+73952717700">
                +7 (3952) 717-700
              </a>
            </li>
            <li>
              <a className={styles.linkContact} href="mailto:info@inf.market">
                info@inf.market
              </a>
            </li>
            <li>
              <span>
                Inf.market <br />
                {format(new Date(), 'yyyy')} (С) Все права защищены.
              </span>
            </li>
          </ul>
        </div> */}
    </footer>
  );
}
