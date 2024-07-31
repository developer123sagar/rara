/* eslint-disable @typescript-eslint/no-explicit-any */
import { url } from "@/routes";
import { IPaymentInitialState, PaymentMode } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: IPaymentInitialState = {
  loading: false,
  selectedPaymentMethod: "CASH_ON_DEVLIVERY",
  error: "",
};

export const payment = createAsyncThunk(
  "payment",
  async ({
    api,
    token,
    data,
  }: {
    api: string;
    token: string;
    data?: any;
    paymentMode: PaymentMode;
  }) => {
    try {
      const res = await axios.post(`${url}/${api}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      return res.data;
    } catch (err: any) {
      throw new Error(err.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setSelectedPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(payment.pending, (state) => {
        state.loading = true;
      })
      .addCase(payment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(payment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      });
  },
});

export default paymentSlice.reducer;
export const { setSelectedPaymentMethod } = paymentSlice.actions;
