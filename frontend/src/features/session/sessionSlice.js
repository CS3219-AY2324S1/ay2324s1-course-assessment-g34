import { createSlice } from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    questionId: null,
    isQuestionLoading: true,
    difficulty: "",
    isOngoing: false,
  },
  reducers: {
    setQuestionId: (state, action) => {
      state.questionId = action.payload;
    },
    setIsQuestionLoading: (state, action) => {
      state.isQuestionLoading = action.payload;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
    setIsOnGoing: (state, action) => {
      state.isOngoing = action.payload;
    }
  }
});

export const { setQuestionId, setIsQuestionLoading, setDifficulty, setIsOnGoing } = sessionSlice.actions;
export default sessionSlice.reducer;

export const selectQuestionId = (state) => state.session.questionId;
export const selectIsQuestionLoading = (state) => state.session.isQuestionLoading;
export const selectDifficulty = (state) => state.session.difficulty;
export const selectIsOngoing = (state) => state.session.isOngoing;
