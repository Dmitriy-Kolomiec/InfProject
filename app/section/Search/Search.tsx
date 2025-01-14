import Page from '@/app/components/Page/Page';
import { SearchPageContent } from './Content';
import { ISearchResults } from '@/interface/search/search.interface';

interface IProps {
  serchProductsList: ISearchResults | null;
  searchString: string;
}

export const SearchPage = ({ serchProductsList, searchString }: IProps) => {
  return (
    <Page>
      <SearchPageContent
        serchProductsList={serchProductsList}
        searchString={searchString}
      />
    </Page>
  );
};
