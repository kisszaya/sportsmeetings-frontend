import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import ProfileSlice from "./ProfileSlice";
import categoriesSlice from "./categoriesSlice";
import meetingsSlice from "./meetingsSlice";
import meetingRequestsSlice from "./meetingRequestsSlice";
import telegramSlice from "./telegramSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: ProfileSlice,
    categories: categoriesSlice,
    meetings: meetingsSlice,
    meetingRequests: meetingRequestsSlice,
    telegram: telegramSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
