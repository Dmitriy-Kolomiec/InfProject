import { fetchInfo } from '@/data/api/publicPart/requests';
import { IDataInfo } from '@/interface/info/info.intrerface';
import { notFound } from 'next/navigation';
import InfoPage from '@/app/section/Info/Informations';

export async function generateStaticParams() {
  const dataInfo: IDataInfo[] = await fetchInfo();
  const slugPages =
    dataInfo
      ?.map(info => ({
        slug: info.label,
      }))
      .filter(item => item.slug !== 'contacts') || [];
  return slugPages;
}

export default async function InformationSection({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const dataInfo: IDataInfo[] = await fetchInfo();

    const filterData = dataInfo.filter(info => info.label !== 'contacts');

    return <InfoPage dataInfo={filterData} slug={params.slug} />;
  } catch (error) {
    console.error('Ошибка запросе страницы:', error);
    return notFound();
  }
}
