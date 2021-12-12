import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import meetingsAPI from "api/meetingsAPI";
import {
  CreateMeetingType,
  getAllMeetingsType,
  getMeetingByIdType,
  getRequestsByMeetingIdType,
} from "types/MeetingTypes";
import { userInfo } from "./ProfileSlice";

// Register interface
interface Meetings {
  status: "loading" | "idle" | "resolved" | "rejected";
  error: string | undefined | null;
  allMeetings: {
    currentPage: number;
    distanceInMeters: number;
    userLatitude: number | null;
    userLongitude: number | null;
    categoryIds: number[] | null;
    data: getAllMeetingsType | null;
  };
  myCreatedMeetings: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
    createdData: {
      currentPage: number;
      data: getAllMeetingsType | null;
    };
    finishedData: {
      currentPage: number;
      data: getAllMeetingsType | null;
    };
    requests: {
      status: "loading" | "idle" | "resolved" | "rejected";
      data:
        | {
            meetingId: number;
            data: getRequestsByMeetingIdType | null;
          }[]
        | [];
      error: string | undefined | null;
      currentPage: number;
    };
  };
  myAttendedMeetings: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
    createdData: {
      currentPage: number;
      data: getAllMeetingsType | null;
    };
    finishedData: {
      currentPage: number;
      data: getAllMeetingsType | null;
    };
  };
  meetingById: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
    data: getMeetingByIdType | null;
  };
}

// Errors interface
type FetchAuthError = {
  message: string;
};

// Thunks
export const createNewMeeting = createAsyncThunk<
  void,
  CreateMeetingType,
  { rejectValue: FetchAuthError }
>(
  "meetings/createNewMeeting",
  async function (args, { rejectWithValue, getState, dispatch }) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const response = await meetingsAPI.createMeeting(token as string, args);
    if (response.status === 200) {
      dispatch(
        getMyCreatedMeetings({
          size: 5,
          meetingStatus: "CREATED",
          currentPage: 0,
        })
      );
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const getAllMeetings = createAsyncThunk<
  void,
  void,
  { rejectValue: FetchAuthError }
>(
  "meetings/getAllMeetings",
  async function (args, { rejectWithValue, getState, dispatch }) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const allMeetingsData = state.meetings.allMeetings;

    if (allMeetingsData.userLongitude && allMeetingsData.userLatitude) {
      let response;
      if (!allMeetingsData.categoryIds) {
        response = await meetingsAPI.getAllMeetings(
          token as string,
          allMeetingsData.currentPage,
          allMeetingsData.distanceInMeters,
          allMeetingsData.userLatitude,
          allMeetingsData.userLongitude
        );
      } else {
        response = await meetingsAPI.getAllMeetings(
          token as string,
          allMeetingsData.currentPage,
          allMeetingsData.distanceInMeters,
          allMeetingsData.userLatitude,
          allMeetingsData.userLongitude,
          allMeetingsData.categoryIds
        );
      }
      if (response.status === 200) {
        dispatch(setAllMeetings(response.data));
        return;
      } else {
        return rejectWithValue({
          message: `Непредвиденный ответ ${response.status} от сервера`,
        });
      }
    }
  }
);

export const getMyCreatedMeetings = createAsyncThunk<
  void,
  { size: number; currentPage: number; meetingStatus: "CREATED" | "FINISHED" },
  { rejectValue: FetchAuthError }
>(
  "meetings/getMyCreatedMeetings",
  async function (
    { size, currentPage, meetingStatus },
    { rejectWithValue, getState, dispatch }
  ) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const response = await meetingsAPI.getMyCreatedMeetings(
      token as string,
      currentPage,
      meetingStatus,
      size
    );
    if (response.status === 200) {
      if (meetingStatus === "CREATED")
        dispatch(setMyCreatedMeetings(response.data));
      if (meetingStatus === "FINISHED")
        dispatch(setMyCreatedFinishedMeetings(response.data));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const getMyAttendedMeetings = createAsyncThunk<
  void,
  { size: number; currentPage: number; meetingStatus: "CREATED" | "FINISHED" },
  { rejectValue: FetchAuthError }
>(
  "meetings/getMyAttendedMeetings",
  async function (
    { size, currentPage, meetingStatus },
    { rejectWithValue, getState, dispatch }
  ) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const response = await meetingsAPI.getMyAttendedMeetings(
      token as string,
      currentPage,
      meetingStatus,
      size
    );
    if (response.status === 200) {
      if (meetingStatus === "CREATED")
        dispatch(setMyAttendedMeetings(response.data));
      if (meetingStatus === "FINISHED")
        dispatch(setMyAttendedFinishedMeetings(response.data));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const getMeetingById = createAsyncThunk<
  void,
  number,
  { rejectValue: FetchAuthError }
>(
  "meetings/getMeetingById",
  async function (meetingId, { rejectWithValue, getState, dispatch }) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const response = await meetingsAPI.getMeetingById(
      token as string,
      meetingId
    );
    if (response.status === 200) {
      dispatch(setMeetingById(response.data));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

export const getCoordinates = createAsyncThunk<
  void,
  void,
  { rejectValue: FetchAuthError }
>(
  "meetings/getCoordinates",
  async function (args, { rejectWithValue, dispatch }) {
    if (!navigator.geolocation) {
      return rejectWithValue({
        message: `Геолокация не поддерживается вашим браузером`,
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat: number = position.coords.latitude;
          const lng: number = position.coords.longitude;
          dispatch(setCoordinates({ lat: lat, lng: lng }));
        },
        () => {
          return rejectWithValue({
            message: `Невозможно определить вашу геолокацию`,
          });
        }
      );
    }
  }
);

export const getRequestsByMeetingId = createAsyncThunk<
  void,
  number,
  { rejectValue: FetchAuthError }
>(
  "meetings/getRequestsByMeetingId",
  async function (meetingId, { rejectWithValue, getState, dispatch }) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const currentPage = state.meetings.myCreatedMeetings.requests.currentPage;
    const response = await meetingsAPI.getRequestsByMeetingId(
      token as string,
      currentPage,
      meetingId
    );
    if (response.status === 200) {
      response.data.requests.forEach(
        (request: {
          description: string;
          id: number;
          meetingId: number;
          userId: number;
        }) => dispatch(userInfo(request.userId))
      );

      dispatch(setRequests({ data: response.data, meetingId: meetingId }));
      return;
    } else {
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
    }
  }
);

// CreateSlice
const initialState: Meetings = {
  status: "idle",
  error: null,
  allMeetings: {
    currentPage: 0,
    distanceInMeters: 9999999,
    userLatitude: null,
    userLongitude: null,
    categoryIds: null,
    data: null,
  },
  myCreatedMeetings: {
    status: "idle",
    error: null,
    createdData: {
      currentPage: 0,
      data: null,
    },
    finishedData: {
      data: null,
      currentPage: 0,
    },
    requests: {
      status: "idle",
      error: null,
      data: [],
      currentPage: 0,
    },
  },
  myAttendedMeetings: {
    status: "idle",
    error: null,
    createdData: {
      currentPage: 0,
      data: null,
    },
    finishedData: {
      data: null,
      currentPage: 0,
    },
  },
  meetingById: {
    status: "idle",
    error: null,
    data: null,
  },
};

// categoriesSlice
const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    setAllMeetings(state, action: PayloadAction<getAllMeetingsType>) {
      state.allMeetings.data = action.payload;
    },
    setMyCreatedMeetings(
      state,
      action: PayloadAction<getAllMeetingsType | null>
    ) {
      state.myCreatedMeetings.createdData.data = action.payload;
    },
    setMyCreatedFinishedMeetings(
      state,
      action: PayloadAction<getAllMeetingsType | null>
    ) {
      state.myCreatedMeetings.finishedData.data = action.payload;
    },
    setMyAttendedMeetings(
      state,
      action: PayloadAction<getAllMeetingsType | null>
    ) {
      state.myAttendedMeetings.createdData.data = action.payload;
    },
    setMyAttendedFinishedMeetings(
      state,
      action: PayloadAction<getAllMeetingsType | null>
    ) {
      state.myAttendedMeetings.finishedData.data = action.payload;
    },
    setRequests(
      state,
      action: PayloadAction<{
        data: getRequestsByMeetingIdType;
        meetingId: number;
      }>
    ) {
      state.myCreatedMeetings.requests.data = [
        ...state.myCreatedMeetings.requests.data,
        action.payload,
      ];
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.allMeetings.currentPage = action.payload;
    },
    setDistanceInMeters(state, action: PayloadAction<number>) {
      state.allMeetings.distanceInMeters = action.payload;
    },
    setCategoryIds(state, action: PayloadAction<Array<number> | null>) {
      state.allMeetings.categoryIds = action.payload ? action.payload : null;
    },
    setMeetingById(state, action: PayloadAction<getMeetingByIdType>) {
      state.meetingById.data = action.payload;
    },
    setCoordinates(state, action: PayloadAction<{ lat: number; lng: number }>) {
      state.allMeetings.userLongitude = action.payload.lng;
      state.allMeetings.userLatitude = action.payload.lat;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createNewMeeting.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(createNewMeeting.fulfilled, (state) => {
      state.status = "resolved";
      state.error = null;
    });
    builder.addCase(createNewMeeting.rejected, (state, action) => {
      state.status = "rejected";
      state.error = action.payload?.message;
    });
    builder.addCase(getMyAttendedMeetings.pending, (state) => {
      state.myAttendedMeetings.status = "loading";
      state.myAttendedMeetings.error = null;
    });
    builder.addCase(getMyAttendedMeetings.fulfilled, (state) => {
      state.myAttendedMeetings.status = "resolved";
      state.myAttendedMeetings.error = null;
    });
    builder.addCase(getMyAttendedMeetings.rejected, (state, action) => {
      state.myAttendedMeetings.status = "rejected";
      state.myAttendedMeetings.error = action.payload?.message;
    });
    builder.addCase(getMyCreatedMeetings.pending, (state) => {
      state.myCreatedMeetings.status = "loading";
      state.myCreatedMeetings.error = null;
    });
    builder.addCase(getMyCreatedMeetings.fulfilled, (state) => {
      state.myCreatedMeetings.status = "resolved";
      state.myCreatedMeetings.error = null;
    });
    builder.addCase(getMyCreatedMeetings.rejected, (state, action) => {
      state.myCreatedMeetings.status = "rejected";
      state.myCreatedMeetings.error = action.payload?.message;
    });
    builder.addCase(getMeetingById.pending, (state) => {
      state.meetingById.status = "loading";
      state.meetingById.error = null;
    });
    builder.addCase(getMeetingById.fulfilled, (state) => {
      state.meetingById.status = "resolved";
      state.meetingById.error = null;
    });
    builder.addCase(getMeetingById.rejected, (state, action) => {
      state.meetingById.status = "rejected";
      state.meetingById.error = action.payload?.message;
    });
  },
});

export const {
  setAllMeetings,
  setCurrentPage,
  setCoordinates,
  setCategoryIds,
  setDistanceInMeters,
  setMyCreatedMeetings,
  setMyCreatedFinishedMeetings,
  setMyAttendedMeetings,
  setMeetingById,
  setMyAttendedFinishedMeetings,
  setRequests,
} = meetingsSlice.actions;

export default meetingsSlice.reducer;
