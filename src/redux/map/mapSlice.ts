import { MapInitialState } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: MapInitialState = {
    newPlace: {
        lat: 27.6879224,
        long: 85.3694429,
    },
    showPopUp: false,
}

const mapSlice = createSlice(({
    name: "map",
    initialState,
    reducers: {
        updateNewPlace: (state, action) => {
            const { lat, long } = action.payload;
            state.newPlace = { long, lat };
        },
        setShowPopUp: (state, action) => {
            state.showPopUp = action.payload
        }
    }
}))

export default mapSlice.reducer;
export const { updateNewPlace, setShowPopUp } = mapSlice.actions