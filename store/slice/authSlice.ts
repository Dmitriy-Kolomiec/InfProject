import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState, saveCookieToken } from '../storage';
import APIRequest from '@/data/api/api.utils';
import { ILoginResponse } from '@/interface/auth/auth.interface';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { RootState } from '../store';
import { IUser } from '@/interface/user/user.interface';
import { destroyCookie } from 'nookies';

export interface IAuthState {
  accessToken: string | null;
  isAuth: boolean;
  fingerprint: string | null;
  error: string | null;
  profileUser: IUser | null;
}
export interface IUserPersistentState {
  accessToken: string | null;
}
export interface IErrorResponse {
  error: string;
}

export const ACCES_TOKEN_PERSISTENT = 'userData';

const initialState: IAuthState = {
  accessToken:
    loadState<IUserPersistentState>(ACCES_TOKEN_PERSISTENT)?.accessToken ??
    null,
  isAuth: !!loadState<IUserPersistentState>(ACCES_TOKEN_PERSISTENT)
    ?.accessToken,
  fingerprint: null,
  error: null,
  profileUser: null,
};

export const login = createAsyncThunk<
  ILoginResponse,
  { code: string; phone: string; fpHash: string },
  { rejectValue: IErrorResponse }
>(
  'user/login',
  async (
    params: { code: string; phone: string; fpHash: string },
    { rejectWithValue },
  ) => {
    try {
      const requestBody = {
        code: params.code,
        phone: params.phone,
        fpHash: params.fpHash,
      };
      const { data } = await APIRequest.post<ILoginResponse>(
        API_ENDPOINTS.LOGIN,
        requestBody,
      );

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Неизвестная ошибка' });
    }
  },
);

// Вход в чужой аккаунт
export const loginDifferentUser = createAsyncThunk<
  ILoginResponse,
  { id: string },
  { rejectValue: IErrorResponse }
>(
  'user/loginDifferentUser',
  async (params: { id: string }, { rejectWithValue }) => {
    try {
      const requestBody = {
        userId: params.id,
      };
      const { data } = await APIRequest.post(
        API_ENDPOINTS.LOGIN_DIFFERENT_USER,
        requestBody,
      );

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Неизвестная ошибка' });
    }
  },
);

export const getProfileUser = createAsyncThunk<
  IUser,
  void,
  { state: RootState }
>('user/getProfileUser', async (_, thunkApi) => {
  const jwt = thunkApi.getState().auth.accessToken;
  const { data } = await APIRequest.get<any>(API_ENDPOINTS.GET_DATA_USER, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  return data;
});

export const logout = createAsyncThunk<void, void, { state: RootState }>(
  'user/logout',
  async (_, { dispatch, rejectWithValue }) => {
    destroyCookie(null, 'accessToken');
    dispatch(authActions.loggedOut());
    try {
      await APIRequest.get(API_ENDPOINTS.LOGOUT);
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ error: 'Неизвестная ошибка' });
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFP: (state, action: PayloadAction<string>) => {
      state.fingerprint = action.payload;
    },
    loggedOut: state => {
      state.accessToken = null;
      state.isAuth = false;
      destroyCookie(null, 'accessToken');
    },
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isAuth = !!action.payload.accessToken;
      saveCookieToken(action.payload.accessToken);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload ? action.payload.error : 'Ошибка при логине';
    });
    builder.addCase(loginDifferentUser.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isAuth = !!action.payload.accessToken;
      saveCookieToken(action.payload.accessToken);
    });
    builder.addCase(loginDifferentUser.rejected, (state, action) => {
      state.error = action.payload
        ? action.payload.error
        : 'Ошибка при входе в другой аккаунт';
    });
    builder.addCase(getProfileUser.fulfilled, (state, action) => {
      state.profileUser = action.payload;
    });
    builder.addCase(logout.fulfilled, state => {
      state.accessToken = null;
      state.isAuth = false;
      state.profileUser = null;
      state.fingerprint = null;
    });
  },
});
export default authSlice.reducer;

export const authActions = authSlice.actions;
