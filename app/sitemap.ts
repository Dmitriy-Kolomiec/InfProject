import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const WEBSITE_HOST_URL =
    process.env.NEXT_PUBLIC_API_SERVER_UR || 'http://localhost:3000';
  return [
    {
      url: WEBSITE_HOST_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 100,
    },
  ];

  //    // Пример получения данных из API
  //    const response = await fetch(`${WEBSITE_HOST_URL}/api/catalog/aliases`);
  //    const aliases = await response.json();

  //    // Создаем статичные маршруты
  //    const staticRoutes = [
  //      {
  //        url: WEBSITE_HOST_URL,
  //        lastModified: new Date(),
  //        changeFrequency: 'weekly',
  //        priority: 0.5,
  //      }
  //    ];

  //    // Генерация маршрутов для alias
  //    const aliasRoutes = aliases.map((alias: string) => ({
  //      url: `${WEBSITE_HOST_URL}/catalog/${alias}`,
  //      lastModified: new Date(),
  //      changeFrequency: 'weekly',
  //      priority: 0.5,
  //    }));

  //    return [...staticRoutes, ...aliasRoutes];
}
