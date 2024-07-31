import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentStep: 1,
    status: "",
};

export const stepperSlice = createSlice({
    name: "stepper",
    initialState,
    reducers: {
        handleNext: (state) => {
            state.currentStep = Math.min(state.currentStep + 1, 4);
        },
        handlePrev: (state) => {
            state.currentStep = Math.max(state.currentStep - 1, 1);
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setCurrentStepperStep: (state, action) => {
            state.currentStep = action.payload
        }
    },
});

export const { handleNext, handlePrev, setStatus, setCurrentStepperStep } = stepperSlice.actions;

export default stepperSlice.reducer;
