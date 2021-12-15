import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import meetingsAPI from "api/meetingsAPI";
import {
  allMeetingsType,
  CreateMeetingType,
  getAllMeetingsType,
  getMeetingByIdType,
  getRequestsByMeetingIdType,
} from "types/MeetingTypes";

// Register interface
interface Meetings {
  status: "loading" | "idle" | "resolved" | "rejected";
  error: string | undefined | null;
  createMeeting: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
  };
  allMeetings: {
    status: "loading" | "idle" | "resolved" | "rejected";
    error: string | undefined | null;
    totalPage: number;
    distanceInMeters: number;
    userLatitude: number | null;
    userLongitude: number | null;
    data: allMeetingsType | null;
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
  {
    categoryIds: number[] | null;
    currentPage: number;
    distanceInKilometers: number;
  },
  { rejectValue: FetchAuthError }
>(
  "meetings/getAllMeetings",
  async function (
    { categoryIds, currentPage, distanceInKilometers },
    { rejectWithValue, getState, dispatch }
  ) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const allMeetingsData = state.meetings.allMeetings;
    const distanceInMeters = distanceInKilometers * 1000;

    if (allMeetingsData.userLongitude && allMeetingsData.userLatitude) {
      let response;
      if (!categoryIds) {
        response = await meetingsAPI.getAllMeetings(
          token as string,
          currentPage,
          distanceInMeters,
          allMeetingsData.userLatitude,
          allMeetingsData.userLongitude
        );
      } else {
        console.log("ci", categoryIds);
        response = await meetingsAPI.getAllMeetings(
          token as string,
          currentPage,
          distanceInMeters,
          allMeetingsData.userLatitude,
          allMeetingsData.userLongitude,
          categoryIds
        );
      }
      if (response.status === 200) {
        console.log("in response 200", response.data.meetings.length);
        dispatch(setAllMeetingsTotalPage(response.data.totalPage));
        dispatch(setAllMeetings(response.data.meetings));
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
      // response.data.requests.forEach(
      //   (request: {
      //     description: string;
      //     id: number;
      //     meetingId: number;
      //     userId: number;
      //   }) => dispatch(userInfo(request.userId))
      // );
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
  createMeeting: {
    status: "idle",
    error: null,
  },
  allMeetings: {
    status: "idle",
    error: null,
    totalPage: 1,
    distanceInMeters: 9999999,
    userLatitude: null,
    userLongitude: null,
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
    setAllMeetings: function (
      state,
      action: PayloadAction<allMeetingsType | null>
    ) {
      if (action.payload === null) {
        state.allMeetings.data = null;
      } else if (state.allMeetings.data === null) {
        state.allMeetings.data = action.payload;
      } else {
        action.payload.forEach((meeting) =>
          state.allMeetings?.data?.push(meeting)
        );
      }
    },
    setAllMeetingsTotalPage(state, action: PayloadAction<number>) {
      state.allMeetings.totalPage = action.payload;
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
      } | null>
    ) {
      state.myCreatedMeetings.requests.data =
        action.payload === null
          ? []
          : [...state.myCreatedMeetings.requests.data, action.payload];
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
      state.createMeeting.status = "loading";
      state.createMeeting.error = null;
    });
    builder.addCase(createNewMeeting.fulfilled, (state) => {
      state.createMeeting.status = "resolved";
      state.createMeeting.error = null;
    });
    builder.addCase(createNewMeeting.rejected, (state, action) => {
      state.createMeeting.status = "rejected";
      state.createMeeting.error = action.payload?.message;
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
    builder.addCase(getAllMeetings.pending, (state) => {
      state.allMeetings.status = "loading";
      state.allMeetings.error = null;
    });
    builder.addCase(getAllMeetings.fulfilled, (state) => {
      state.allMeetings.status = "resolved";
      state.allMeetings.error = null;
    });
    builder.addCase(getAllMeetings.rejected, (state, action) => {
      state.allMeetings.status = "rejected";
      state.allMeetings.error = action.payload?.message;
    });
  },
});

export const {
  setAllMeetings,
  setCoordinates,
  setMyCreatedMeetings,
  setMyCreatedFinishedMeetings,
  setMyAttendedMeetings,
  setMeetingById,
  setMyAttendedFinishedMeetings,
  setRequests,
  setAllMeetingsTotalPage,
} = meetingsSlice.actions;

export default meetingsSlice.reducer;
