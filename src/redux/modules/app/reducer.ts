import { Screen } from "@src/enums"
import { AppSettings } from "@src/models/app-settings"
import BigNumber from "bignumber.js"
import { AppAction, AppActionsTypes } from "./types"

export interface AppState {
  coins: any
  prices: any
  mktCap: BigNumber
  dayVolume: number
  insurance: number
  validators: Array<any>
  totalSupply: BigNumber
  totalStaked: BigNumber
  totalBonded: BigNumber
  avgReward: BigNumber
  apr: string
  blockTime: string
  blocks: Array<any>
  tokens: Array<any>
  balances: any
  delegations: Array<any>
  rewards: Array<any>
  appSettings: AppSettings
}

const initialState: AppState = {
  coins: null,
  prices: {
    swth: {
      usd: 0.0,
    },
  },
  mktCap: new BigNumber(0),
  dayVolume: 0,
  insurance: 0,
  validators: new Array(),
  totalSupply: new BigNumber(0),
  totalStaked: new BigNumber(0),
  totalBonded: new BigNumber(0),
  avgReward: new BigNumber(0),
  apr: "0",
  blockTime: "0.00",
  blocks: new Array(),
  tokens: new Array(),
  balances: null,
  delegations: new Array(),
  rewards: new Array(),
  appSettings: {
    address: null,
    launchScreen: Screen.Dashboard,
  },
}

export default function appReducer(state = initialState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionsTypes.SET_APP_SETTINGS:
      return {
        ...state,
        appSettings: action.appSettings,
      }
    case AppActionsTypes.SET_ADDRESS:
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          address: action.address,
        },
      }
    case AppActionsTypes.SET_LAUNCH_SCREEN:
      return {
        ...state,
        appSettings: {
          ...state.appSettings,
          launchScreen: action.launchScreen ?? Screen.Dashboard,
        },
      }
    case AppActionsTypes.SET_VALIDATORS:
      return {
        ...state,
        validators: action.validators,
        totalBonded: action.totalBonded,
      }
    case AppActionsTypes.SET_COINS_LIST:
      return {
        ...state,
        coins: action.coins,
      }
    case AppActionsTypes.SET_REWARDS:
      return {
        ...state,
        rewards: action.rewards,
      }
    case AppActionsTypes.SET_DELEGATIONS:
      return {
        ...state,
        delegations: action.delegations,
      }
    case AppActionsTypes.SET_BALANCE:
      return {
        ...state,
        balances: action.balance,
      }
    case AppActionsTypes.SET_TOKENS:
      return {
        ...state,
        tokens: action.tokens,
      }
    case AppActionsTypes.SET_PRICES:
      return {
        ...state,
        prices: action.prices,
      }
    case AppActionsTypes.SET_SUPPLY:
      return {
        ...state,
        totalSupply: action.totalSupply,
        mktCap: action.mktCap,
      }
    case AppActionsTypes.SET_STAKING_POOL:
      return {
        ...state,
        totalStaked: action.totalStaked,
      }
    case AppActionsTypes.SET_BLOCKS:
      return {
        ...state,
        blocks: action.blocks,
      }
    case AppActionsTypes.SET_AVG_REWARD:
      return {
        ...state,
        avgReward: action.avgReward,
      }
    case AppActionsTypes.SET_BLOCK_TIME:
      return {
        ...state,
        blockTime: action.blockTime,
        apr: action.apr,
      }
    default:
      return state
  }
}
