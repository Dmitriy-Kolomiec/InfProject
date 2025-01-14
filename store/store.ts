import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import authSlice, { ACCES_TOKEN_PERSISTENT } from './slice/authSlice';
import { saveState } from './storage';
import cartSlice, { KEY_CART_PRODUCTS } from './slice/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
  },
});

store.subscribe(() => {
  saveState(
    { accessToken: store.getState().auth.accessToken },
    ACCES_TOKEN_PERSISTENT,
  );
  saveState(store.getState().cart.products, KEY_CART_PRODUCTS);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
