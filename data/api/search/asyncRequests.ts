import { API_ENDPOINTS } from '../api.data';
import { ISearchResults } from '@/interface/search/search.interface';

interface IFetchSearch {
  searchString: string;
}

export async function fetchSearchProducts({
  searchString,
}: IFetchSearch): Promise<ISearchResults | null> {
  const jsonString = JSON.stringify({
    query: searchString,
  });
  const payload = encodeURIComponent(jsonString);

  try {
    const response = await fetch(API_ENDPOINTS.GET_PUBLIC_SEARCH(payload));
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Ошибка при поиске продуктов:', error);
  }
  return null;
}
