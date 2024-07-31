import { IcartDatas, MessageType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface CartState {
  cartDatas: IcartDatas[];
  loading: boolean;
  message: MessageType[];
  checkoutCartDatas: IcartDatas[];
  isBanquetCart: boolean;
  checkoutBanquetCartDatas: {
    _id: string;
    plan: string;
    restaurant: string;
    price: number;
  } | null;
  banquetCartDatas: {
    _id: string;
    plan: string;
    restaurant: string;
    price: number;
  }[];
}

const initialCartData = localStorage.getItem("cartDatas");
const initialCheckoutCartData = localStorage.getItem("checkoutCartDatas");
const initialBanquetCartData = localStorage.getItem("banquetCart");
const initialCheckoutBanquetCartData = localStorage.getItem(
  "checkoutBanquetCart"
);

const initialState: CartState = {
  cartDatas: initialCartData ? JSON.parse(initialCartData) : [],
  loading: false,
  message: [],
  checkoutCartDatas: initialCheckoutCartData
    ? JSON.parse(initialCheckoutCartData)
    : [],
  isBanquetCart: false,
  banquetCartDatas: initialBanquetCartData
    ? JSON.parse(initialBanquetCartData)
    : [],
  checkoutBanquetCartDatas: initialBanquetCartData
    ? JSON.parse(initialCheckoutBanquetCartData!)
    : {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart(state, action) {
      const { _id, minQuantity } = action.payload;

      const index = state.cartDatas.findIndex((item) => item._id === _id);
      if (index === -1) {
        state.cartDatas = [...state.cartDatas, action.payload];
      } else {
        const qty = state.cartDatas[index].minQuantity;
        const qtyInc = qty + minQuantity;
        state.cartDatas[index].minQuantity = qtyInc;

        const price = state.cartDatas[index].price;
        const total = price * qtyInc;

        state.cartDatas[index].total = total;
      }

      localStorage.setItem("cartDatas", JSON.stringify(state.cartDatas));
    },
    removeItem(state, action) {
      const { _id } = action.payload;
      state.cartDatas = state.cartDatas.filter((item) => item._id !== _id);
      state.checkoutCartDatas = state.checkoutCartDatas.filter(
        (item) => item._id !== _id
      );

      localStorage.setItem("cartDatas", JSON.stringify(state.cartDatas));
      localStorage.setItem(
        "checkoutCartDatas",
        JSON.stringify(state.checkoutCartDatas)
      );
    },
    removeBanquetData(state, action) {
      const _id = action.payload;

      state.banquetCartDatas = state.banquetCartDatas.filter(
        (item) => item._id !== _id
      );
      if (
        state.checkoutBanquetCartDatas &&
        state.checkoutBanquetCartDatas._id === _id
      ) {
        state.checkoutBanquetCartDatas = null;
        localStorage.removeItem("checkoutBanquetCart");
      }
      localStorage.setItem(
        "banquetCart",
        JSON.stringify(state.banquetCartDatas)
      );
    },
    clearCart(state) {
      state.cartDatas = [];
      localStorage.removeItem("cartDatas");
    },

    incrementItem(state, action) {
      const _id = action.payload;
      const index1 = state.cartDatas.findIndex((item) => item._id === _id);
      const index2 = state.checkoutCartDatas.findIndex(
        (item) => item._id === _id
      );

      if (index1 !== -1 && index2 !== -1) {
        const qty1 = state.cartDatas[index1].minQuantity;
        const qty2 = state.checkoutCartDatas[index2].minQuantity;
        const qtyInc1 = qty1 + 1;
        const qtyInc2 = qty2 + 1;
        state.cartDatas[index1].minQuantity = qtyInc1;
        state.checkoutCartDatas[index2].minQuantity = qtyInc2;

        const price1 = state.cartDatas[index1].price;
        const price2 = state.checkoutCartDatas[index2].price;
        const total1 = price1 * qtyInc1;
        const total2 = price2 * qtyInc2;

        state.cartDatas[index1].total = total1;
        state.checkoutCartDatas[index2].total = total2;

        localStorage.setItem("cartDatas", JSON.stringify(state.cartDatas));
        localStorage.setItem(
          "checkoutCartDatas",
          JSON.stringify(state.checkoutCartDatas)
        );
      }
    },
    decrementItem(state, action) {
      const _id = action.payload;
      const index1 = state.cartDatas.findIndex((item) => item._id === _id);
      const index2 = state.checkoutCartDatas.findIndex(
        (item) => item._id === _id
      );

      if (index1 !== -1 && index2 !== -1) {
        const qty1 = state.cartDatas[index1].minQuantity;
        const qty2 = state.checkoutCartDatas[index2].minQuantity;
        const qtyDec1 = qty1 - 1;
        const qtyDec2 = qty2 - 1;

        if (qtyDec1 >= 1 && qtyDec2 >= 1) {
          state.cartDatas[index1].minQuantity = qtyDec1;
          state.checkoutCartDatas[index2].minQuantity = qtyDec2;

          const price1 = state.cartDatas[index1].price;
          const price2 = state.checkoutCartDatas[index2].price;
          const total1 = price1 * qtyDec1;
          const total2 = price2 * qtyDec2;

          state.cartDatas[index1].total = total1;
          state.checkoutCartDatas[index2].total = total2;

          localStorage.setItem("cartDatas", JSON.stringify(state.cartDatas));
          localStorage.setItem(
            "checkoutCartDatas",
            JSON.stringify(state.checkoutCartDatas)
          );
        }
      }
    },
    removeMsg: (state) => {
      state.message.shift();
    },
    addCheckoutCartDatas: (state, action) => {
      state.checkoutCartDatas = action.payload;
      localStorage.setItem(
        "checkoutCartDatas",
        JSON.stringify(state.checkoutCartDatas)
      );
    },
    setBanquetCartDatas: (state, action) => {
      const existingPlan = state.banquetCartDatas?.find(
        (plan: any) => plan?._id === action.payload._id
      );
      if (!existingPlan) {
        state.banquetCartDatas = [...state?.banquetCartDatas, action.payload];
        localStorage.setItem(
          "banquetCart",
          JSON.stringify(state.banquetCartDatas)
        );
        state.isBanquetCart = true;
        toast.success(`You have added ${action.payload.plan}`);
      } else {
        toast.error(`You have already added this ${action.payload.plan}`);
      }
    },
    setCheckoutBanquetCartDatas: (state, action) => {
      state.checkoutBanquetCartDatas = action.payload;
      localStorage.setItem(
        "checkoutBanquetCart",
        JSON.stringify(state.checkoutBanquetCartDatas)
      );
    },
  },
});

export default cartSlice.reducer;
export const {
  addCart,
  removeMsg,
  removeItem,
  clearCart,
  incrementItem,
  decrementItem,
  addCheckoutCartDatas,
  setBanquetCartDatas,
  setCheckoutBanquetCartDatas,
  removeBanquetData,
} = cartSlice.actions;
