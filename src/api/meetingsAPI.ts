import axios from "axios";

import {
  CreateMeetingType,
  getAllCategoriesType,
  getAllMeetingsType,
  getMeetingByIdType,
  getRequestsByMeetingIdType,
  updateRequestStatusType,
} from "types/MeetingTypes";

const instance = axios.create({
  baseURL: "https://api.sportsmeetings.daniilkaranov.ru/meetings",
});

const userAPI = {
  async getAllCategories(token: string, currentPage = 0) {
    return instance
      .get<getAllCategoriesType>(`/categories?page=${currentPage}&size=20`, {
        headers: {
          Authorization: token,
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
  async createMeeting(token: string, meeting: CreateMeetingType) {
    return instance
      .post<{ token: string }>("", meeting, {
        headers: {
          Authorization: token,
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
  async getMyCreatedMeetings(
    token: string,
    currentPage = 0,
    meetingStatus: "CREATED" | "FINISHED",
    size: number
  ) {
    return instance
      .get<getAllMeetingsType>(
        `/created?page=${currentPage}&size=${size}&meetingStatus=${meetingStatus}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch(function (error) {
        return error.response;
      });
  },
  async getRequestsByMeetingId(
    token: string,
    currentPage = 0,
    meetingId: number
  ) {
    return instance
      .get<getRequestsByMeetingIdType>(
        `/${meetingId}/requests?page=${currentPage}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch(function (error) {
        return error.response;
      });
  },
  async updateRequestStatus(
    token: string,
    meetingId: number,
    requestId: number,
    requestToJoinMeetingStatus: "ACCEPTED" | "DENIED"
  ) {
    return instance
      .put<updateRequestStatusType>(
        `/${meetingId}/requests/${requestId}`,
        { requestToJoinMeetingStatus },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch(function (error) {
        return error.response;
      });
  },
  async updateParticipantInMeeting(
    token: string,
    meetingId: number,
    participantId: number,
    updateParticipantStatusReqDto: "ADD" | "REMOVE"
  ) {
    return instance
      .put<updateRequestStatusType>(
        `/${meetingId}`,
        { participantId, updateParticipantStatusReqDto },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch(function (error) {
        return error.response;
      });
  },
  async getMyAttendedMeetings(
    token: string,
    currentPage = 0,
    meetingStatus: "CREATED" | "FINISHED",
    size: number
  ) {
    return instance
      .get<getAllMeetingsType>(
        `/attended?page=${currentPage}&size=${size}&meetingStatus=${meetingStatus}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch(function (error) {
        return error.response;
      });
  },
  async getMeetingById(token: string, meetingId: number) {
    return instance
      .get<getMeetingByIdType>(`/${meetingId}`, {
        headers: {
          Authorization: token,
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
  async createRequestToJoinMeeting(
    token: string,
    meetingId: number,
    description: string
  ) {
    return instance
      .post(
        `/${meetingId}/requests`,
        { description },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .catch(function (error) {
        return error.response;
      });
  },
  async getAllMeetings(
    token: string,
    currentPage = 0,
    distanceInMeters = 99999999,
    userLatitude: number,
    userLongitude: number,
    categoryIds?: Array<number>
  ) {
    if (categoryIds)
      return instance
        .get<getAllMeetingsType>(
          `?page=${currentPage}&distanceInMeters=${distanceInMeters}&userLatitude=${userLatitude}&userLongitude=${userLongitude}&categoryIds=${categoryIds}&size=20`,
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .catch(function (error) {
          return error.response;
        });
    else
      return instance
        .get<getAllMeetingsType>(
          `?page=${currentPage}&distanceInMeters=${distanceInMeters}&userLatitude=${userLatitude}&userLongitude=${userLongitude}&size=20`,
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .catch(function (error) {
          return error.response;
        });
  },
};

export default userAPI;
