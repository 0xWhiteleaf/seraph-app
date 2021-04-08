import { constants } from "@src/constants"
import axios, { AxiosInstance } from "axios"

let coinGeckoClient: AxiosInstance = axios.create({
  baseURL: constants.COINGECKO_API_BASE_URL,
})

export function useCoinGeckoClient(): AxiosInstance {
  return coinGeckoClient
}
