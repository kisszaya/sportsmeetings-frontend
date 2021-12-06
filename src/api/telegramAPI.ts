import axios from "axios";
import {ActivationCodeType} from "types/TelegramTypes";

const instance = axios.create({
  baseURL: "https://api.sportsmeetings.daniilkaranov.ru/telegram-bot/",
});

const telegramAPI = {
  async getActivationCode(token: string) {
    return instance.get<ActivationCodeType>(`activation-code`, {
      headers: {
        Authorization: token,
      },
    }).catch(function (error) {
      return error.response;
    });
  }
};

export default telegramAPI;
