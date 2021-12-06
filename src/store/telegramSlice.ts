import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import telegramAPI from "api/telegramAPI";

// Register interface
interface Telegram {
  status: "loading" | "idle" | "resolved" | "rejected";
  error: string | undefined | null;
  code: string | null;
}

// Errors interface
type FetchAuthError = {
  message: string;
};

// Thunks
export const getActivationCode = createAsyncThunk<
  void,
  void,
  { rejectValue: FetchAuthError }
>(
  "telegram/code",
  async function (args, { rejectWithValue, getState, dispatch }) {
    const authState = getState() as RootState;
    const token = authState.auth.userToken;
    const response = await telegramAPI.getActivationCode(token as string);

    if (response.status === 200) {
      dispatch(setActivationCode(response.data.code));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

// CreateSlice
const initialState: Telegram = {
  status: "idle",
  error: null,
  code: null,
};

// profileSlice
const telegramSlice = createSlice({
  name: "telegram",
  initialState,
  reducers: {
    setActivationCode(state, action: PayloadAction<string>) {
      state.code = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getActivationCode.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getActivationCode.fulfilled, (state) => {
      state.status = "resolved";
      state.error = null;
    });
    builder.addCase(getActivationCode.rejected, (state, action) => {
      state.status = "rejected";
      state.error = action.payload?.message;
    });
  },
});

export const { setActivationCode } = telegramSlice.actions;

export default telegramSlice.reducer;
