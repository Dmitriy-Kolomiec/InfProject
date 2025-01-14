import Link from 'next/link';
import CommentIcon from '@/public/comment.svg';
import EllispsisIcon from '@/public/gray-ellipsis.svg';
import StarIcon from '@/public/star.svg';
import styles from './infoAboutCompany.module.css';
import { Tag } from 'antd';
import { InfoAboutCompanyProps } from './infoAboutCompany.props';
import classNames from 'classnames';

export default function InfoAboutCompany({
  name,
  rating,
  numComments,
  width = 'small',
  qualityMark,
  className,
  ...props
}: InfoAboutCompanyProps) {
  return (
    <div
      className={classNames([styles.container, className], {
        [styles.small]: width === 'small',
        [styles.medium]: width === 'medium' || qualityMark,
        [styles.large]: width === 'large',
      })}
      {...props}
    >
      <Link href="/" className={styles.link}>
        {name}
      </Link>
      <div
        className={classNames([
          styles.cellFlex,
          {
            [styles.flexContainer]: qualityMark,
          },
        ])}
      >
        {qualityMark && (
          <Tag
            className={classNames(['text-uppercase', styles.tag])}
            color="#2fc227"
          >
            Надежный поставщик
          </Tag>
        )}
        <div className={styles.cellFlex}>
          <div className={styles.rating}>
            <span className={styles.text}>{rating}</span>
            <StarIcon />
          </div>
          <div className={classNames([styles.comment, styles.button])}>
            <span className={styles.text}>{numComments}</span>
            <CommentIcon />
          </div>
          <div className={styles.button}>
            <EllispsisIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
