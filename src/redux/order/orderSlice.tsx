import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalOrders: 0,
  lat: "",
  lon: "",
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    changeOrderNumber: (state, action) => {
      state.totalOrders = action.payload;
    },
    setLatLong: (state, action) => {
      const { lat, lon } = action.payload;
      state.lat = lat;
      state.lon = lon;
    },
  },
});

export const { changeOrderNumber, setLatLong } = orderSlice.actions;

export default orderSlice.reducer;
