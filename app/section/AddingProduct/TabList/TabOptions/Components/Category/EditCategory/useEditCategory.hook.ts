import { useState } from 'react';

const categories = [
  { id: '1111', name: 'Трансмиссия' },
  { id: '2222', name: 'Двигатель' },
  { id: '3333', name: 'Ходовая часть' },
  { id: '4444', name: 'Кузов' },
];

const subCategories = [
  { id: '5555', name: 'Сцепление' },
  { id: '6666', name: 'Система охлаждения' },
  { id: '7777', name: 'Система охлаждения двигателя' },
  { id: '8888', name: 'Вентилятор принудительного охлаждения радиатора' },
];
export const useEditCategories = () => {
  const [category, setCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [additionalSubCategory, setAdditionalSubCategory] =
    useState<string>('');
  const handleCategoryChange = (value: string) => {
    console.log('handleCategoryChange', value);
    if (value !== 'none') {
      setCategory(value);
    }
  };
  const handleSubCategoryChange = (value: string) => {
    console.log('handleSubCategoryChange', value);
    setSubCategory(value);
  };

  const handleAdditionalSubCategoryChange = (value: string) => {
    console.log('handleSubCategoryChange', value);
    setSubCategory(value);
  };

  return {
    categories,
    subCategories,
    category,
    subCategory,
    additionalSubCategory,
    handleCategoryChange,
    handleSubCategoryChange,
    handleAdditionalSubCategoryChange,
  };
};
