import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { destroyCookie, parseCookies } from 'nookies';
import { API_ENDPOINTS } from './api.data';
import { ILoginResponse } from '@/interface/auth/auth.interface';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { saveCookieToken } from '@/store/storage';
import { APP_PATHS } from '../paths.data';
import { notify } from '../utils.common';

const APIRequest: AxiosInstance = axios.create({
  withCredentials: true,
});

// Добавляем заголовки в каждый запрос
APIRequest.interceptors.request.use(
  config => {
    const cookies = parseCookies();
    const accessToken = cookies['accessToken'];

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
// Отлавливаем ошибку 401, делаем refresh token и продолжаем дальше запрос.
APIRequest.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();
        const { data } = await APIRequest.post<ILoginResponse>(
          API_ENDPOINTS.REFRESH,
          { visitorId: visitorId },
        );
        const newAccessToken = data.accessToken;
        if (newAccessToken) {
          saveCookieToken(newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Ошибка обновления токена', refreshError);
        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 403
        ) {
          notify('error', {
            message: refreshError.response.data,
          });
          destroyCookie(null, 'accessToken');
          destroyCookie(null, 'refreshToken');
          localStorage.removeItem('userData');
          window.location.href = APP_PATHS.LOGIN;
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

// Функция для отправки запроса с универсальным обработчиком ответа
async function sendRequest<T>(
  method: string,
  url: string,
  data: any = null,
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await APIRequest({
      method,
      url,
      data,
    });
    return response.data; // Возвращаем данные из ответа без обёртки
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Обработка ошибок AxiosError
      const axiosError: AxiosError = error;
      if (axiosError.response) {
        console.error('Response error:', axiosError.response.data);
        throw new Error('Request failed with response error');
      } else if (axiosError.request) {
        console.error('Request error:', axiosError.request);
        throw new Error('Request failed without response');
      } else {
        console.error('Error:', axiosError.message);
        throw new Error('Request failed with unknown error');
      }
    } else {
      // Обработка других ошибок
      console.error('Error:', error);
      throw new Error('Request failed with unknown error');
    }
  }
}

export default APIRequest;
