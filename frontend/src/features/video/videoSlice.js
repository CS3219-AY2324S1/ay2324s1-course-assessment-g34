import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: 'video',
  initialState: {
    isRequestingCall: false,
    hasCallRequest: false,
    isPeerMuted: false,
    isPeerVideoOn: false,
  },
  reducers: {
    setIsRequestingCall: (state, action) => {
      state.isRequestingCall = action.payload;
    },
    setHasCallRequest: (state, action) => {
      state.hasCallRequest = action.payload;
    },
    setIsPeerMuted: (state, action ) => {
      state.isPeerMuted = action.payload;
    },
    setIsPeerVideoOn: (state, action) => {
      state.isPeerVideoOn = action.payload;
    },
  }
});

export const {
  setIsRequestingCall,
  setHasCallRequest,
  setIsPeerMuted,
  setIsPeerVideoOn,
} = videoSlice.actions;

export default videoSlice.reducer;

export const selectIsRequestingCall = (state) => state.video.isRequestingCall;
export const selectHasCallRequest = (state) => state.video.hasCallRequest;
export const selectIsCalling = (state) => state.video.isCalling;
export const selectIsPeerMuted = (state) => state.video.isPeerMuted;
export const selectIsPeerVideoOn = (state) => state.video.isPeerVideoOn;
