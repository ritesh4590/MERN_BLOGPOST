import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Config from "../../components/Config";

const initialState = {
  isLoading: false,
  user: "",
  userProfile: "",
  isError: false,
};

export const user = createAsyncThunk("user", async ({ bearerToken }) => {
  try {
    const { data } = await Config.get("/user", {
      headers: {
        Authorization: bearerToken,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
});

export const getUserProfile = createAsyncThunk(
  "userProfile",
  async ({ bearerToken }) => {
    try {
      const { data } = await Config.get("user/userprofile", {
        headers: {
          Authorization: bearerToken,
        },
      });
      console.log("userprofile response:", data);
      return data;
    } catch (error) {
      throw error.response.data.message;
    }
  }
);

const UserSlice = createSlice({
  name: "User",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(user.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(user.fulfilled, (state, action) => {
      (state.isLoading = false), (state.user = action.payload);
    });
    builder.addCase(user.rejected, (state, action) => {
      state.isLoading = true;
      state.isError = true;
    });
    builder.addCase(getUserProfile.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      (state.isLoading = false), (state.userProfile = action.payload);
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = true;
      state.isError = true;
    });
  },
});

export default UserSlice.reducer;
