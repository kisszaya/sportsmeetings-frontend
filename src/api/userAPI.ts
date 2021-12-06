import axios from "axios";
import {
  createCommentType,
  getCommentsType,
  getMyCreatedCommentsType,
  getMyInfoType,
  getUserInfoType,
} from "../types/UsersTypes";

const instance = axios.create({
  baseURL: "https://api.sportsmeetings.daniilkaranov.ru/users/",
});

const userAPI = {
  async getMyInfo(token: string) {
    return instance
      .get<getMyInfoType>(`info`, {
        headers: {
          Authorization: token,
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
  async getMyCreatedComments(token: string) {
    return instance
      .get<getMyCreatedCommentsType>("comments", {
        headers: {
          Authorization: token,
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
  async getUserInfo(token: string, userId: number) {
    return instance
      .get<getUserInfoType>(`${userId}`, {
        headers: {
          Authorization: token,
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
  async getCommentsByRecipientId(
    token: string,
    userId: number,
    currentPage = 0
  ) {
    return instance
      .get<getCommentsType>(`${userId}/comments?page=${currentPage}&size=8`, {
        headers: {
          Authorization: token,
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
  async createComment(token: string, userId: number, text: string) {
    return instance
      .post<createCommentType>(
        `${userId}/comments`,
        { text },
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
  async deleteMyCreatedComment(token: string, commentId: number) {
    return instance
      .delete(`comments/${commentId}`, {
        headers: {
          Authorization: token,
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
  async changeMyInfo(
    token: string,
    confirmPassword: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string | null
  ) {
    return instance
      .put(
        "info",
        { confirmPassword, email, firstName, lastName, password },
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
  async loadMyPhoto(token: string, photo: File) {
    const formData = new FormData();
    formData.append("photo", photo);

    return instance
      .put("photo", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .catch(function (error) {
        return error.response;
      });
  },
};

export default userAPI;
