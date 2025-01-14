import { SearchPage } from '@/app/section/Search/Search';
import { fetchSearchProducts } from '@/data/api/search/asyncRequests';
import { notFound } from 'next/navigation';
import React from 'react';

interface IQueryParams {
  search?: string;
}

export default async function Search({
  searchParams,
}: {
  searchParams: IQueryParams;
}) {
  const serchProductsList = await fetchSearchProducts({
    searchString: searchParams.search || '',
  });
  if (!serchProductsList) {
    console.error('Ошибка поиске товара:');
    return notFound();
  }

  return (
    <SearchPage
      serchProductsList={serchProductsList}
      searchString={searchParams.search || ''}
    />
  );
}
