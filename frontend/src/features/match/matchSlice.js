import { createSlice } from '@reduxjs/toolkit';

export const matchSlice = createSlice({
  name: 'match',
  initialState: {
    sessionId: null,
    username: null,
  },
  reducers: {
    setMatchedUser: (state, action) => {
      state.username = action.payload;
    },
    resetMatchedUser: (state, action) => {
      state.username = null;
    },
    setSession: (state, action) => {
      state.sessionId = action.payload;
    },
    resetSession: (state) => {
      state.sessionId = null;
    },
  },
});

export const {
  setMatchedUser, resetMatchedUser, setSession, resetSession,
} = matchSlice.actions;
export default matchSlice.reducer;

export const selectSessionId = (state) => state.match.sessionId;
export const selectMatchedUsername = (state) => state.match.username;
