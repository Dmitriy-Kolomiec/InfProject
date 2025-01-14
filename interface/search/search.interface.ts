export interface ISearchResults {
  searchingResults: ISearchProduct[];
}

export interface ISearchProduct {
  manufacturer: { id: number; name: string; label: string };
  partNumber: { id: number; name: string };
  product: { id: number; name: string };
  stockBalance: { price: number; vat: number };
}
