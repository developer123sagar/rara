import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RestaurantState {
    wishlist: string[];
}

const initialState: RestaurantState = {
    wishlist: JSON.parse(localStorage.getItem("favRestros") || "[]"),
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        toggleWishlist: (state, action: PayloadAction<string>) => {
            const restroId = action.payload;
            if (state.wishlist.includes(restroId)) {
                state.wishlist = state.wishlist.filter(id => id !== restroId);
            } else {
                state.wishlist.push(restroId);
            }
            localStorage.setItem("favRestros", JSON.stringify(state.wishlist));
        },
        setWishlist: (state, action: PayloadAction<string[]>) => {
            state.wishlist = action.payload;
            localStorage.setItem("favRestros", JSON.stringify(state.wishlist));
        },
    },
});

export const { toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;