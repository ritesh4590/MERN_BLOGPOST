import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/AuthSlice";
import UserReducer from "./features/UserSlice";
import BlogReducer from "./features/BlogSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: UserReducer,
    blog: BlogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // This disables the serializable check
    }).concat(),
});

export default store;
