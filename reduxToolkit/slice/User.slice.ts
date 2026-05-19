import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ===============================
// TYPES
// ===============================
interface IUser {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
}

interface IUserState {
  user: IUser | null;
  token: string | null;
}

// ===============================
// INITIAL STATE
// ===============================
const initialState: IUserState = {
  user: null,
  token: null,
};

// ===============================
// SLICE
// ===============================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ LOGIN / SET USER
    setUser: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // ✅ LOGOUT / CLEAR USER
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;