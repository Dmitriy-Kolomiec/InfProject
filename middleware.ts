import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const currentPath = request.nextUrl.pathname;

  // Исключаем статические файлы, страницу логина и все, что начинается с /catalog
  const publicPaths = [
    '/',
    '/login',
    '/_next',
    '/favicon.ico',
    '/static',
    '/info',
    '/cart',
    '/contacts',
  ];

  const isPublicPath =
    publicPaths.some(
      path => currentPath === path || currentPath.startsWith(`${path}/`),
    ) ||
    currentPath.startsWith('/catalog') ||
    currentPath.startsWith('/info');

  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Указываем не доступные роуты
  const restrictedPaths = [, '/info', '/catalog/product'];
  const isRestrictedPath = restrictedPaths.includes(currentPath);

  if (isRestrictedPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Если у пользователя есть accessToken или он на странице логина, продолжаем
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico|static|login).*)'],
};
