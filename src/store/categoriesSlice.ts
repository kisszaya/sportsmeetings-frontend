import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import meetingsAPI from "api/meetingsAPI";

// Register interface
interface Categories {
  status: "loading" | "idle" | "resolved" | "rejected";
  error: string | undefined | null;
  categories: { id: number; name: string }[] | null | [];
  currentPage: number;
}

// Errors interface
type FetchAuthError = {
  message: string;
};

// Thunks
export const allCategories = createAsyncThunk<
  void,
  void,
  { rejectValue: FetchAuthError }
>(
  "categories/allCategories",
  async function (args, { rejectWithValue, getState, dispatch }) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const currentPage = state.categories.currentPage;
    const response = await meetingsAPI.getAllCategories(
      token as string,
      currentPage
    );

    if (response.status === 200) {
      dispatch(setCategories(response.data.categories));
      return;
    } else if (response.status === 400) {
      return rejectWithValue({
        message: `Не смогли загрузить категории`,
      });
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

// CreateSlice
const initialState: Categories = {
  status: "idle",
  error: null,
  categories: null,
  currentPage: 0,
};

// categoriesSlice
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setCategories(
      state,
      action: PayloadAction<Array<{ id: number; name: string }>>
    ) {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(allCategories.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(allCategories.fulfilled, (state) => {
      state.status = "resolved";
      state.error = null;
    });
    builder.addCase(allCategories.rejected, (state, action) => {
      state.status = "rejected";
      state.error = action.payload?.message;
    });
  },
});

export const { setCategories, setCurrentPage } = categoriesSlice.actions;

export default categoriesSlice.reducer;
