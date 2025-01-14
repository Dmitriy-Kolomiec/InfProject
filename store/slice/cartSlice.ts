import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState } from '../storage';
import { ICartItem } from '@/app/components/Product/components/tablePartNumbers/useTablePartNumbers.hook';

export interface ICartState {
  products: ICartItem[];
}

export const KEY_CART_PRODUCTS = 'cartProducts';

const initialState: ICartState = {
  products: loadState<ICartItem[]>(KEY_CART_PRODUCTS) ?? [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<ICartItem>) => {
      const existed = state.products.find(
        i => i.partNumberId === action.payload.partNumberId,
      );

      if (!existed) {
        state.products.push({
          productName: action.payload.productName,
          productId: action.payload.productId,
          partNumber: action.payload.partNumber,
          partNumberId: action.payload.partNumberId,
          quantity: action.payload.quantity,
          summ: {
            price: action.payload.summ.price,
            vat: action.payload.summ.vat,
          },
          manufacturer: action.payload.manufacturer,
          warehouse: {
            name: action.payload.warehouse.name,
            amount: action.payload.warehouse.amount,
          },
        });
        return;
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ partNumberId: number; quantity: number }>,
    ) => {
      const product = state.products.find(
        i => i.partNumberId === action.payload.partNumberId,
      );

      if (product) {
        product.quantity = action.payload.quantity;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products.forEach((product, index) => {
        if (product.partNumberId === action.payload) {
          state.products.splice(index, 1);
        }
      });
    },
    removeCartProducts: state => {
      state.products = [];
      localStorage.removeItem(KEY_CART_PRODUCTS);
    },
  },
});

export default cartSlice.reducer;

export const cartActions = cartSlice.actions;
