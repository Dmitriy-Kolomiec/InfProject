import ContactsPage from '@/app/section/Contacts/Contacts';
import { fetchInfo } from '@/data/api/publicPart/requests';
import { IDataInfo } from '@/interface/info/info.intrerface';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function Contacts() {
  try {
    const dataInfo: IDataInfo[] = await fetchInfo();

    const contactsInfo = dataInfo.find(info => info.label === 'contacts');

    if (!!dataInfo) {
      return <ContactsPage contactsInfo={contactsInfo} />;
    }
    return notFound();
  } catch (error) {
    console.error('Ошибка запросе страницы c контактами:', error);
    return notFound();
  }
}
