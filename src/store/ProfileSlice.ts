import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userAPI from "api/userAPI";
import { RootState } from "store";
import {
  getCommentsType,
  getMyInfoType,
  getUserInfoType,
} from "../types/UsersTypes";

// Register interface
interface Profile {
  status: "loading" | "idle" | "resolved" | "rejected";
  error: string | undefined | null;
  myInfo: {
    data: getMyInfoType | null;
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
  };
  usersInfo: getMyInfoType[] | [];
  comments: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
    data: getCommentsType | null;
    currentPage: number;
  };
  changeInfo: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
  };
}

// Errors interface
type FetchAuthError = {
  message: string;
};

// Thunks
export const myInfo = createAsyncThunk<
  void,
  void,
  { rejectValue: FetchAuthError }
>(
  "profile/myInfo",
  async function (args, { rejectWithValue, getState, dispatch }) {
    const authState = getState() as RootState;
    console.log("in my info");
    const token = authState.auth.userToken;
    const response = await userAPI.getMyInfo(token as string);

    if (response.status === 200) {
      dispatch(setMyInfo(response.data));
      return;
    } else if (response.status === 403) {
      localStorage.removeItem("x-auth-token");
      window.location.reload();
      return rejectWithValue({
        message: `Нет доступа. Попробуйте обновить страницу`,
      });
    } else if (response.status === 404) {
      return rejectWithValue({
        message: `Не найдено. Попробуйте обновить страницу`,
      });
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const userInfo = createAsyncThunk<
  void,
  number,
  { rejectValue: FetchAuthError }
>(
  "profile/userInfo",
  async function (userId, { rejectWithValue, getState, dispatch }) {
    const authState = getState() as RootState;
    const token = authState.auth.userToken;
    const response = await userAPI.getUserInfo(token as string, userId);

    if (response.status === 200) {
      dispatch(setUserInfo(response.data));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const changeMyInfo = createAsyncThunk<
  void,
  {
    confirmPassword: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string | null;
    photo: File | null;
  },
  { rejectValue: FetchAuthError }
>(
  "profile/changeMyInfo",
  async function (
    { confirmPassword, email, firstName, lastName, password, photo },
    { rejectWithValue, getState, dispatch }
  ) {
    const authState = getState() as RootState;
    const token = authState.auth.userToken;

    const response = await userAPI.changeMyInfo(
      token as string,
      confirmPassword,
      email,
      firstName,
      lastName,
      password
    );

    if (response.status === 200) {
      dispatch(myInfo());
      if (photo) dispatch(loadPhoto(photo));
      return;
    } else if (response.status === 403) {
      return rejectWithValue({
        message: `Неправльно введен пароль`,
      });
    } else if (response.status === 400) {
      return rejectWithValue({
        message: `Данные введены неверно! Попробуйте еще`,
      });
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const loadPhoto = createAsyncThunk<
  void,
  File,
  { rejectValue: FetchAuthError }
>(
  "profile/loadPhoto",
  async function (photo, { rejectWithValue, getState, dispatch }) {
    const authState = getState() as RootState;
    const token = authState.auth.userToken;
    const response = await userAPI.loadMyPhoto(token as string, photo);

    if (response.status === 200) {
      window.location.reload();
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const getComments = createAsyncThunk<
  void,
  number,
  { rejectValue: FetchAuthError }
>(
  "profile/getComments",
  async function (userId, { rejectWithValue, getState, dispatch }) {
    const authState = getState() as RootState;
    const token = authState.auth.userToken;
    const currentPage = authState.profile.comments.currentPage;
    const response = await userAPI.getCommentsByRecipientId(
      token as string,
      userId,
      currentPage
    );

    if (response.status === 200) {
      dispatch(setComments(response.data));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const createComment = createAsyncThunk<
  void,
  { userId: number; text: string },
  { rejectValue: FetchAuthError }
>(
  "profile/createComment",
  async function ({ userId, text }, { rejectWithValue, getState, dispatch }) {
    const authState = getState() as RootState;
    const token = authState.auth.userToken;
    const response = await userAPI.createComment(token as string, userId, text);

    if (response.status === 200) {
      dispatch(getComments(userId));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const deleteComment = createAsyncThunk<
  void,
  { commentId: number; userId: number },
  { rejectValue: FetchAuthError }
>(
  "profile/deleteComment",
  async function (
    { commentId, userId },
    { rejectWithValue, getState, dispatch }
  ) {
    const authState = getState() as RootState;
    const token = authState.auth.userToken;
    const response = await userAPI.deleteMyCreatedComment(
      token as string,
      commentId
    );

    if (response.status === 200) {
      dispatch(getComments(userId));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

// CreateSlice
const initialState: Profile = {
  status: "idle",
  error: null,
  myInfo: {
    data: null,
    error: null,
    status: "idle",
  },
  usersInfo: [],
  comments: {
    status: "idle",
    error: null,
    currentPage: 0,
    data: null,
  },
  changeInfo: {
    status: "idle",
    error: null,
  },
};

// profileSlice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setMyInfo(state, action: PayloadAction<getMyInfoType | null>) {
      state.myInfo.data = action.payload;
    },
    setUserInfo(state, action: PayloadAction<getUserInfoType>) {
      state.usersInfo = [...state.usersInfo, action.payload];
    },
    nullUsersInfo(state) {
      state.usersInfo = [];
    },
    setComments(state, action: PayloadAction<getCommentsType>) {
      state.comments.data = action.payload;
    },
    setCommentsCurrentPage(state, action: PayloadAction<number>) {
      state.comments.currentPage = action.payload;
    },
    setCommentsStatus(state, action: PayloadAction<"loading" | "idle" | "resolved" | "rejected">) {
      state.comments.status = action.payload;
    },
    setChangeInfoStatus(
      state,
      action: PayloadAction<"loading" | "idle" | "resolved" | "rejected">
    ) {
      state.changeInfo.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(myInfo.pending, (state) => {
      state.myInfo.status = "loading";
      state.myInfo.error = null;
    });
    builder.addCase(myInfo.fulfilled, (state) => {
      state.myInfo.status = "resolved";
      state.myInfo.error = null;
    });
    builder.addCase(myInfo.rejected, (state, action) => {
      state.myInfo.status = "rejected";
      state.myInfo.error = action.payload?.message;
    });
    builder.addCase(userInfo.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(userInfo.fulfilled, (state) => {
      state.status = "resolved";
      state.error = null;
    });
    builder.addCase(userInfo.rejected, (state, action) => {
      state.status = "rejected";
      state.error = action.payload?.message;
    });
    builder.addCase(changeMyInfo.pending, (state) => {
      state.changeInfo.status = "loading";
      state.changeInfo.error = null;
    });
    builder.addCase(changeMyInfo.fulfilled, (state) => {
      state.changeInfo.status = "resolved";
      state.changeInfo.error = null;
    });
    builder.addCase(changeMyInfo.rejected, (state, action) => {
      state.changeInfo.status = "rejected";
      state.changeInfo.error = action.payload?.message;
    });
    builder.addCase(loadPhoto.pending, (state) => {
      state.changeInfo.status = "loading";
      state.changeInfo.error = null;
    });
    builder.addCase(loadPhoto.fulfilled, (state) => {
      state.changeInfo.status = "resolved";
      state.changeInfo.error = null;
    });
    builder.addCase(loadPhoto.rejected, (state, action) => {
      state.changeInfo.status = "rejected";
      state.changeInfo.error = action.payload?.message;
    });
    builder.addCase(createComment.pending, (state) => {
      state.comments.status = "loading";
      state.comments.error = null;
    });
    builder.addCase(createComment.fulfilled, (state) => {
      state.comments.status = "resolved";
      state.comments.error = null;
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.comments.status = "rejected";
      state.comments.error = action.payload?.message;
    });
  },
});

export const {
  setMyInfo,
  setUserInfo,
  nullUsersInfo,
  setComments,
  setChangeInfoStatus,
  setCommentsCurrentPage, setCommentsStatus
} = profileSlice.actions;

export default profileSlice.reducer;
