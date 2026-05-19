// reduxToolkit/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "../slice/loader.slice";
import userReducer from "../slice/User.slice"; // ✅ import your slice

const store = configureStore({
  reducer: {
    loader: loaderReducer,
    user: userReducer, // ✅ add here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;