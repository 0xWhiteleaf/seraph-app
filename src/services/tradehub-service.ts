import { constants } from "@src/constants";
import { Network, RestClient } from "tradehub-api-js";
import axios, { AxiosInstance } from "axios";

// Tradescan
let tradescanClient: RestClient | null = null;

export function useTradescanClient(
  network: Network = Network.MainNet
): RestClient {
  if (tradescanClient === null)
    tradescanClient = new RestClient({ network: network });

  return tradescanClient;
}

// Tendermint
let tendermintClient: AxiosInstance = axios.create({
  baseURL: constants.TENDERMIN_API_BASE_URL,
});

export function useTendermintClient(): AxiosInstance {
  return tendermintClient;
}
