import CategoryPage from '@/app/section/Category/pages/Category';

export default function Category({ params }: { params: { alias: string } }) {
  return <CategoryPage alias={params.alias} />;
}
