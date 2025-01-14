import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useProductsCard = () => {
  const searchParams = useSearchParams();
  const page: number = Number(searchParams.get('page')) || 1;
  const pageSize: number = Number(searchParams.get('pageSize')) || 10;
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleChangeSelect = (value: string) => {
    router.replace(pathname + '?' + createQueryString('pageSize', value));
  };

  const onChangePagination = (value: number) => {
    router.replace(
      pathname + '?' + createQueryString('page', value.toString()),
    );
  };
  return {
    page,
    pageSize,
    handleChangeSelect,
    onChangePagination,
  };
};
