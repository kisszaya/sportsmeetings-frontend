import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import authAPI from "api/authAPI";
import { myInfo, setMyInfo } from "./ProfileSlice";
import { allCategories } from "./categoriesSlice";

// Register interface
interface Auth {
  register: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
  };
  login: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
  };
  initialize: {
    status: "loading" | "idle" | "resolved" | "rejected";
  };
  userToken: null | string;
}

// Errors interface
type FetchAuthError = {
  message: string;
};

// Thunks
export const login = createAsyncThunk<
  void,
  { password: string; username: string },
  { rejectValue: FetchAuthError }
>(
  "auth/login",
  async function ({ password, username }, { rejectWithValue, dispatch }) {
    const response = await authAPI.login(password, username);
    switch (response.status) {
      case 200: {
        localStorage.setItem("x-auth-token", response.data.token);
        await dispatch(setUserToken(response.data.token));
        await dispatch(myInfo());
        await dispatch(allCategories());
        return;
      }
      case 400: {
        return rejectWithValue({
          message: "Данные формы введены неверно!",
        });
      }
      case 403: {
        return rejectWithValue({
          message: "Неверные логин или пароль!",
        });
      }
      case 404: {
        return rejectWithValue({
          message: "Такого пользователя не существует!",
        });
      }
      default: {
        return rejectWithValue({
          message: `Непредвиденный ответ ${response.status} от сервера`,
        });
      }
    }
  }
);

export const register = createAsyncThunk<
  void,
  {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
  },
  { rejectValue: FetchAuthError }
>(
  "auth/register",
  async function (
    { email, firstName, lastName, password, username },
    { rejectWithValue, dispatch }
  ) {
    const response = await authAPI.register(
      email,
      firstName,
      lastName,
      password,
      username
    );
    switch (response.status) {
      case 200: {
        localStorage.setItem("x-auth-token", response.data.token);
        await dispatch(setUserToken(response.data.token));
        await dispatch(myInfo());
        await dispatch(allCategories());
        return;
      }
      case 400: {
        return rejectWithValue({
          message: "Данные формы введены неверно!",
        });
      }
      case 409: {
        return rejectWithValue({
          message: "Пользователь с таким никнеймом уже существует!",
        });
      }
      default: {
        return rejectWithValue({
          message: `Непредвиденный ответ ${response.status} от сервера`,
        });
      }
    }
  }
);

export const unregister = createAsyncThunk<void, void>(
  "auth/unregister",
  async function (args, { dispatch }) {
    localStorage.removeItem("x-auth-token");
    dispatch(setUserToken(null));
    dispatch(setMyInfo(null));
    window.location.reload();
  }
);

export const initialize = createAsyncThunk<void, void>(
  "auth/initialize",
  async function (args, { dispatch }) {
    const token = localStorage.getItem("x-auth-token");
    if (token) {
      await dispatch(setUserToken(token));
      await dispatch(myInfo());
      await dispatch(allCategories());
    }
    return;
  }
);

// CreateSlice
const initialState: Auth = {
  register: {
    status: "idle",
    error: null,
  },
  login: {
    status: "idle",
    error: null,
  },
  initialize: {
    status: "idle",
  },
  userToken: null,
};

// AuthSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserToken(state, action: PayloadAction<string | null>) {
      state.userToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.login.status = "loading";
      state.login.error = null;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.login.status = "resolved";
      state.login.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.login.status = "rejected";
      state.login.error = action.payload?.message;
    });
    builder.addCase(register.pending, (state) => {
      state.register.status = "loading";
      state.register.error = null;
    });
    builder.addCase(register.fulfilled, (state, { payload }) => {
      state.register.status = "resolved";
    });
    builder.addCase(register.rejected, (state, action) => {
      state.register.status = "rejected";
      state.register.error = action.payload?.message;
    });
    builder.addCase(initialize.pending, (state) => {
      state.initialize.status = "loading";
    });
    builder.addCase(initialize.fulfilled, (state, { payload }) => {
      state.initialize.status = "resolved";
    });
  },
});

export const { setUserToken } = authSlice.actions;

export default authSlice.reducer;
