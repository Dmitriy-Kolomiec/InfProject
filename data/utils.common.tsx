import { IDataProduct } from '@/interface/addingProduct/product.interface';
import { FormInstance } from 'antd';
import htmr from 'htmr';
import React from 'react';
import { notification } from 'antd';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { IBreadCrumb } from '@/interface/publicPart/publicPart.interface';
import Link from 'next/link';
import { APP_PATHS } from './paths.data';

/**
 * Get number in format 1 000 000,00
 */
export const formatPrice = (price: number): string => {
  return price
    ?.toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    .replace(/\./g, ',');
};

// Number in format 1 000 , 1 000 000 , 2 200 000
export const thousandsSeparator = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Проверка на обязательное заполнение полей. Иначе кнопка disabled
export const onFormFieldsChange = (
  form: FormInstance<IDataProduct>,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  checkingFieldsName: string[],
  changedFields?: any[], // Добавляем параметр для измененных полей
) => {
  // Проверяем, есть ли среди измененных полей обязательные
  const isRelevantChange = changedFields?.some(field =>
    checkingFieldsName.includes(field.name[0]),
  );

  if (!isRelevantChange) return; // Если изменений в обязательных полях нет, выходим

  // Получаем значения всех обязательных полей из формы
  const fieldsValue = form.getFieldsValue(checkingFieldsName);

  // Проверяем, заполнены ли все обязательные поля
  const isRequiredFieldsFilled = Object.values(fieldsValue).every(value => {
    // Если это массив autoModels, проверяем каждую модель
    if (Array.isArray(value)) {
      return value.every(
        model =>
          model &&
          Object.values(model).some(
            subValue =>
              subValue !== undefined && subValue !== null && subValue !== '',
          ),
      );
    }
    // Иначе, проверяем как обычное поле
    return value !== undefined && value !== null && value !== '';
  });

  // Проверяем, есть ли ошибки в форме
  const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);

  // Если все поля заполнены и нет ошибок, кнопка не заблокирована
  const disabled = !isRequiredFieldsFilled || hasErrors;
  setIsDisabled(disabled);
};

// Функция для очистки HTML-текста от лишних стилей
const cleanHtml = (htmlString: string) => {
  return htmlString.replace(
    /<span\s[^>]*style="[^"]*"[^>]*>(.*?)<\/span>/g,
    '<span>$1</span>',
  );
};

// функция для отрисовки html:
export const renderHtml = (str: string, errorText?: any) => {
  try {
    const cleanedHtml = cleanHtml(str);
    return htmr(cleanedHtml);
  } catch (err) {
    if (!errorText) return <></>;
  }
};
// Функция для очистки номера от лишних символов
export const cleanPhoneNumber = (phone: string) => {
  return phone.replace(/[^\d+]/g, '');
};

// Уведомления
type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotificationOptions {
  message: string;
  description?: string;
  duration?: number;
  placement?:
    | 'top'
    | 'topLeft'
    | 'topRight'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight';
}

export const notify = (
  type: NotificationType,
  {
    message,
    duration = 4,
    description,
    placement = 'top',
  }: NotificationOptions,
) => {
  notification[type]({
    message,
    description,
    duration,
    placement: placement,
  });
};

// Удаляем атрибут title у тегов
export const removeAtributeTitle = (data: any) => {
  return data?.map((item: any) => {
    const newItem = { ...item, title: null };
    if (newItem.children) {
      newItem.children = removeAtributeTitle(newItem.children);
    }
    return newItem;
  });
};

// Скачивание файла
export const downloadBlob = async (urlBlob: string, name: string) => {
  const link = document.createElement('a');
  link.href = urlBlob;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

// Решает проблему добавление пустых div при tooltip или select. Проблема у ant design
export const getPopupContainer = (trigger: HTMLElement): HTMLElement => {
  return trigger.parentElement || document.body;
};

// Форматирование даты
interface IPropsFormateDate {
  dateString: string;
  isHours?: boolean;
}

export const formatDate = ({
  dateString,
  isHours = true,
}: IPropsFormateDate) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (isHours) {
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  return `${day}.${month}.${year}`;
};

// Формируем хлебные крошки для catalog (ssr)
export function createBreadcrumbItems(
  categoryTree: IBreadCrumb[] | undefined,
): BreadcrumbItemType[] {
  if (!categoryTree) return [];

  const items: BreadcrumbItemType[] = [
    {
      title: (
        <Link className="bread-crumb_link" href={APP_PATHS.CATALOG}>
          Каталог
        </Link>
      ),
    },
  ];

  let currentCategory = categoryTree.find(
    category => category.parentId === null,
  );
  while (currentCategory) {
    const isLast = !categoryTree.some(
      category => category.parentId === currentCategory?.id,
    );
    items.push({
      title: isLast ? (
        <span className="bread-crumb_item">{currentCategory.name}</span>
      ) : (
        <Link
          href={APP_PATHS.PUBLIC_CATALOG(currentCategory.label)}
          className="bread-crumb_link"
        >
          {currentCategory.name}
        </Link>
      ),
    });
    currentCategory = categoryTree.find(
      category => category.parentId === currentCategory?.id,
    );
  }

  return items;
}

// Склонение слов в зависимости от количества
export function getPlurals(
  number: number,
  one: string,
  two: string,
  three: string,
) {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return three;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return three;
}

// Формирование имени для header
export const generateNameForHeader = (firstName: string, lastName?: string) => {
  const name = lastName ? `${lastName} ${firstName.charAt(0)}.` : firstName;
  return name;
};
// Форматирование номера телефона +79991124423 => +7 (999) 112-44-23
export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
    7,
    9,
  )}-${digits.slice(9, 11)}`;
};
// Обратное форматирование номера телефона +7 (999) 112-44-23  => +79991124423
export const normalizePhone = (phone: string): string => {
  // Убираем все символы, кроме + и цифр
  return phone.replace(/[\s()-]/g, '');
};

// Форматирование даты из YYYY.MM.DD => DD.MM.YYYY
export const convertDateToDDMMYYYY = (date: string) => {
  if (!date) return '';
  const [year, month, day] = date.split('-'); // Разделяем дату на части
  return `${day}.${month}.${year}`; // Возвращаем в новом формате
};
