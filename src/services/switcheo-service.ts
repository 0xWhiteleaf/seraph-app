import { constants } from "@src/constants";
import axios, { AxiosInstance } from "axios";

let switcheoClient: AxiosInstance = axios.create({
  baseURL: constants.SWITCHEO_API_BASE_URL,
});

export function useSwitcheoClient(): AxiosInstance {
  return switcheoClient;
}
