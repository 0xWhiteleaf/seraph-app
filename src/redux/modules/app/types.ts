import { Screen } from "@src/enums"
import { AppSettings } from "@src/models/app-settings"
import { RootState } from "@src/redux"
import BigNumber from "bignumber.js"
import { ThunkAction } from "redux-thunk"

export enum AppActionsTypes {
  SET_APP_SETTINGS = "SET_APP_SETTINGS",
  UPDATE_ADDRESS = "UPDATE_ADDRESS",
  SET_ADDRESS = "SET_ADDRESS",
  UPDATE_LAUNCH_SCREEN = "UPDATE_LAUNCH_SCREEN",
  SET_LAUNCH_SCREEN = "SET_LAUNCH_SCREEN",

  REFRESH_VALIDATORS = "REFRESH_VALIDATORS",
  SET_VALIDATORS = "SET_VALIDATORS",

  REFRESH_COINS_LIST = "REFRESH_COINS_LIST",
  SET_COINS_LIST = "SET_COINS_LIST",

  REFRESH_STAKING = "REFRESH_STAKING",
  REFRESH_REWARDS = "REFRESH_REWARDS",
  SET_REWARDS = "SET_REWARDS",
  REFRESH_DELEGATIONS = "REFRESH_DELEGATIONS",
  SET_DELEGATIONS = "SET_DELEGATIONS",
  REFRESH_BALANCE = "REFRESH_BALANCE",
  SET_BALANCE = "SET_BALANCE",
  REFRESH_TOKENS = "REFRESH_TOKENS",
  SET_TOKENS = "SET_TOKENS",

  REFRESH_DASHBOARD = "REFRESH_DASHBOARD",
  REFRESH_PRICES = "REFRESH_PRICES",
  SET_PRICES = "SET_PRICES",
  REFRESH_SUPPLY = "REFRESH_SUPPLY",
  SET_SUPPLY = "SET_SUPPLY",
  REFRESH_STAKING_POOL = "REFRESH_STAKING_POOL",
  SET_STAKING_POOL = "SET_STAKING_POOL",
  POOL_BLOCKS = "POOL_BLOCKS",
  SET_BLOCKS = "SET_BLOCKS",
  SET_AVG_REWARD = "SET_AVG_REWARD",
  REFRESH_BLOCK_TIME = "REFRESH_BLOCK_TIME",
  SET_BLOCK_TIME = "SET_BLOCK_TIME",
}

export interface SetAppSettingsAction {
  type: typeof AppActionsTypes.SET_APP_SETTINGS
  appSettings: AppSettings
}

export interface UpdateAddressAction {
  type: typeof AppActionsTypes.UPDATE_ADDRESS
}

export interface SetAddressAction {
  type: typeof AppActionsTypes.SET_ADDRESS
  address: string
}

export interface UpdateLaunchScreenAction {
  type: typeof AppActionsTypes.UPDATE_LAUNCH_SCREEN
}

export interface SetLaunchScreenAction {
  type: typeof AppActionsTypes.SET_LAUNCH_SCREEN
  launchScreen: Screen
}

export interface RefreshValidatorsAction {
  type: typeof AppActionsTypes.REFRESH_VALIDATORS
}

export interface SetValidatorsAction {
  type: typeof AppActionsTypes.SET_VALIDATORS
  validators: Array<any>
  totalBonded: BigNumber
}

export interface RefreshCoinsListAction {
  type: typeof AppActionsTypes.REFRESH_COINS_LIST
}

export interface SetCoinsListAction {
  type: typeof AppActionsTypes.SET_COINS_LIST
  coins: any
}

export interface RefreshStakingAction {
  type: typeof AppActionsTypes.REFRESH_STAKING
}

export interface RefreshRewardsAction {
  type: typeof AppActionsTypes.REFRESH_REWARDS
}

export interface SetRewardsAction {
  type: typeof AppActionsTypes.SET_REWARDS
  rewards: any
}

export interface RefreshDelegationsAction {
  type: typeof AppActionsTypes.REFRESH_DELEGATIONS
}

export interface SetDelegationsAction {
  type: typeof AppActionsTypes.SET_DELEGATIONS
  delegations: any
}

export interface RefreshBalanceAction {
  type: typeof AppActionsTypes.REFRESH_BALANCE
}

export interface SetBalanceAction {
  type: typeof AppActionsTypes.SET_BALANCE
  balance: any
}

export interface RefreshTokensAction {
  type: typeof AppActionsTypes.REFRESH_TOKENS
}

export interface SetTokensAction {
  type: typeof AppActionsTypes.SET_TOKENS
  tokens: any
}

export interface RefreshDashboardAction {
  type: typeof AppActionsTypes.REFRESH_DASHBOARD
}

export interface RefreshPricesAction {
  type: typeof AppActionsTypes.REFRESH_PRICES
}

export interface SetPricesAction {
  type: typeof AppActionsTypes.SET_PRICES
  prices: any
}

export interface RefreshSupplyAction {
  type: typeof AppActionsTypes.REFRESH_SUPPLY
}

export interface SetSupplyAction {
  type: typeof AppActionsTypes.SET_SUPPLY
  totalSupply: BigNumber
  mktCap: BigNumber
}

export interface RefreshStakingPoolAction {
  type: typeof AppActionsTypes.REFRESH_STAKING_POOL
}

export interface SetStakingPoolAction {
  type: typeof AppActionsTypes.SET_STAKING_POOL
  totalStaked: BigNumber
}

export interface PoolBlocksAction {
  type: typeof AppActionsTypes.POOL_BLOCKS
}

export interface SetBlocksAction {
  type: typeof AppActionsTypes.SET_BLOCKS
  blocks: any
}

export interface SetAvgRewardAction {
  type: typeof AppActionsTypes.SET_AVG_REWARD
  avgReward: BigNumber
}

export interface RefreshBlockTimeAction {
  type: typeof AppActionsTypes.REFRESH_BLOCK_TIME
}

export interface SetBlockTimeAction {
  type: typeof AppActionsTypes.SET_BLOCK_TIME
  blockTime: string
  apr: string
}

export type AppAction =
  | SetAppSettingsAction
  | SetAddressAction
  | SetLaunchScreenAction
  | RefreshValidatorsAction
  | SetValidatorsAction
  | RefreshCoinsListAction
  | SetCoinsListAction
  | RefreshRewardsAction
  | SetRewardsAction
  | RefreshDelegationsAction
  | SetDelegationsAction
  | RefreshBalanceAction
  | SetBalanceAction
  | RefreshTokensAction
  | SetTokensAction
  | RefreshDashboardAction
  | RefreshPricesAction
  | SetPricesAction
  | RefreshSupplyAction
  | SetSupplyAction
  | RefreshStakingPoolAction
  | SetStakingPoolAction
  | PoolBlocksAction
  | SetBlocksAction
  | SetAvgRewardAction
  | RefreshBlockTimeAction
  | SetBlockTimeAction

export type AppThunk = ThunkAction<Promise<void>, RootState, unknown, AppAction>
