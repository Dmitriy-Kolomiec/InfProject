import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import PrevIcon from '@/public/arrow-prew.svg';
import NextIcon from '@/public/arrow-select.svg';
import styles from './swiperImage.module.css';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { IPublicFileProperty } from '@/interface/publicPart/publicPart.interface';
import { API_SERVER_FILES } from '@/data/env';
import SwiperCore from 'swiper';
import { Button } from 'antd';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '../../../../../../styles/swiper-custom.css';
import classNames from 'classnames';

interface IProps {
  fileId: number;
  files: IPublicFileProperty[];
}

export const SwiperImage = ({ fileId, files }: IProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const nextImage = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const prevImage = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  useEffect(() => {
    if (swiperRef.current) {
      const index = files.findIndex(file => file.fileId === fileId);
      if (index !== -1) {
        swiperRef.current.slideTo(index);
        setActiveIndex(index);
      }
    }
  }, [fileId, files]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mainImage}>
        <Swiper
          onSwiper={swiper => (swiperRef.current = swiper)}
          style={
            {
              '--swiper-navigation-color': '#182F35',
            } as React.CSSProperties
          }
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="main-swiper"
          zoom={true}
          onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
        >
          {files.map(file => (
            <SwiperSlide key={`${file.fileId}_${file.path}`}>
              <img
                className="image"
                src={`${API_SERVER_FILES}/files${file.path}`}
                alt="Slide"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Button
          onClick={prevImage}
          className={classNames([styles.prevSlide, styles.button])}
        >
          <PrevIcon />
        </Button>
        <Button
          onClick={nextImage}
          className={classNames([styles.nextSlide, styles.button])}
        >
          <NextIcon />
        </Button>
      </div>
      <div className={styles.propertyContainer}>
        {!!files[activeIndex] && (
          <>
            {!!files[activeIndex].partNumber ? (
              <span className={styles.property}>
                Каталожный номер: {files[activeIndex].partNumber}
              </span>
            ) : (
              <>
                {files[activeIndex].productName ? (
                  <div className={styles.property}>
                    {files[activeIndex].productName}
                  </div>
                ) : (
                  <div className={styles.property}>
                    {!!files[activeIndex].propertyName && (
                      <span>{files[activeIndex].propertyName}:</span>
                    )}
                    {!!files[activeIndex].valueName && (
                      <span> {files[activeIndex].valueName}</span>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {files.map((file, index) => (
          <SwiperSlide
            className={styles.swiperSlide}
            key={`${file.fileId}_${index}`}
          >
            <img
              className="image"
              src={`${API_SERVER_FILES}/files${file.path}`}
              alt="Thumbnail"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
