import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import meetingsAPI from "api/meetingsAPI";
import { AxiosError } from "axios";
import {getMeetingById, getRequestsByMeetingId} from "./meetingsSlice";

// Register interface
interface MeetingRequests {
  status: "loading" | "idle" | "resolved" | "rejected";
  error: string | undefined | null;
}

// Errors interface
type FetchAuthError = {
  message: string;
};

// Thunks
export const createRequestToJoinMeeting = createAsyncThunk<
  void,
  { meetingId: number; description: string },
  { rejectValue: FetchAuthError }
>(
  "meetingRequests/createRequestToJoinMeeting",
  async function ({ meetingId, description }, { rejectWithValue, getState }) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const response = await meetingsAPI.createRequestToJoinMeeting(
      token as string,
      meetingId,
      description
    );
    if (response.status === 200) {
      return;
    }
    if (response.status === 490) {
      return rejectWithValue({
        message: `Уже подавали завяку`,
      });
    } else
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
  }
);

export const updateRequestStatus = createAsyncThunk<
  void,
  {
    meetingId: number;
    requestId: number;
    requestToJoinMeetingStatus: "ACCEPTED" | "DENIED";
  },
  { rejectValue: FetchAuthError }
>(
  "meetingRequests/updateRequestStatus",
  async function (
    { meetingId, requestId, requestToJoinMeetingStatus },
    { rejectWithValue, getState, dispatch }
  ) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const response = await meetingsAPI.updateRequestStatus(
      token as string,
      meetingId,
      requestId,
      requestToJoinMeetingStatus
    );
    if (response.status === 200) {
      if (requestToJoinMeetingStatus === "ACCEPTED")
        dispatch(
          updateParticipantInMeeting({
            meetingId: meetingId,
            participantId: response.data.userId,
            updateParticipantStatusReqDto: "ADD"
          })
        );
      dispatch(getRequestsByMeetingId(meetingId))
      return;
    } else
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
  }
);

export const updateParticipantInMeeting = createAsyncThunk<
  void,
  {
    meetingId: number;
    participantId: number;
    updateParticipantStatusReqDto: "ADD" | "REMOVE";
  },
  { rejectValue: FetchAuthError }
>(
  "meetingRequests/updateParticipantInMeeting",
  async function (
    { meetingId, participantId, updateParticipantStatusReqDto },
    { rejectWithValue, getState, dispatch }
  ) {
    const state = getState() as RootState;
    const token = state.auth.userToken;
    const response = await meetingsAPI.updateParticipantInMeeting(
      token as string,
      meetingId,
      participantId,
      updateParticipantStatusReqDto
    );

    if (response.status === 200) {
      dispatch(getMeetingById(meetingId))
      return;
    } else if (response.status === 422)
      return rejectWithValue({
        message: `Лимит количества участников превышен`,
      });
    else
      return rejectWithValue({
        message: `Непредвиденный ответ ${response.status} от сервера`,
      });
  }
);

// CreateSlice
const initialState: MeetingRequests = {
  status: "idle",
  error: null,
};

// categoriesSlice
const meetingRequestsSlice = createSlice({
  name: "meetingRequests",
  initialState,
  reducers: {
    setStatusRequests(
      state,
      action: PayloadAction<"loading" | "idle" | "resolved" | "rejected">
    ) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createRequestToJoinMeeting.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(createRequestToJoinMeeting.fulfilled, (state) => {
      state.status = "resolved";
      state.error = null;
    });
    builder.addCase(createRequestToJoinMeeting.rejected, (state, action) => {
      state.status = "rejected";
      console.log("in error", action.payload);
      state.error = action.payload?.message;
    });
  },
});

export const { setStatusRequests } = meetingRequestsSlice.actions;

export default meetingRequestsSlice.reducer;
