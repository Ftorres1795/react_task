import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    selectedTask: null,
  },
  reducers: {
    setSelectedTask: (state, { payload }) => {
      state.selectedTask = payload;
    },
  },
});

export default tasksSlice.reducer;

export const { setSelectedTask } = tasksSlice.actions;
