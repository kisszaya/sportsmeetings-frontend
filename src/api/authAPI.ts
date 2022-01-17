import axios from "axios";

const instance = axios.create({
  baseURL: "https://itmo-backend-project.herokuapp.com/auth/",
});

const authAPI = {
  async login(password: string, username: string) {
    return instance
      .post<{ token: string }>("login", { password, username })
      .catch(function (error) {
        return error.response;
      });
  },
  async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    username: string
  ) {
    return instance
      .post<{ token: string }>("register", {
        email,
        firstName,
        lastName,
        password,
        username,
      })
      .catch(function (error) {
        return error.response;
      });
  },
};

export default authAPI;
