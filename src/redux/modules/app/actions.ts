import { constants } from "@src/constants"
import { useCoinGeckoClient } from "@src/services/coingecko-service"
import { useTendermintClient, useTradescanClient } from "@src/services/tradehub-service"
import BigNumber from "bignumber.js"
import { StakingPool } from "tradehub-api-js"
import { Base64 } from "js-base64"
import { useSwitcheoClient } from "@src/services/switcheo-service"
import { AppAction, AppActionsTypes, AppThunk } from "./types"
import { AppSettings } from "@src/models/app-settings"
import { Screen } from "@src/enums"
import { saveAddress, saveLaunchScreen } from "@src/services/storage-service"

export function setAppSettings(appSettings: AppSettings): AppAction {
  return {
    type: AppActionsTypes.SET_APP_SETTINGS,
    appSettings: appSettings,
  }
}

export function updateAddress(address: string): AppThunk {
  return async function (dispatch) {
    // writing address in local storage
    await saveAddress(address)

    dispatch(setAddress(address))
  }
}

export function setAddress(address: string): AppAction {
  return {
    type: AppActionsTypes.SET_ADDRESS,
    address: address,
  }
}

export function updateLaunchScreen(launchScreen: Screen): AppThunk {
  return async function (dispatch) {
    // writing launch screen in local storage
    await saveLaunchScreen(launchScreen)

    dispatch(setLaunchScreen(launchScreen))
  }
}

export function setLaunchScreen(launchScreen: Screen): AppAction {
  return {
    type: AppActionsTypes.SET_LAUNCH_SCREEN,
    launchScreen: launchScreen,
  }
}

export function refreshValidators(): AppThunk {
  return async function (dispatch) {
    // loading all validators
    const validators = await useTradescanClient().getAllValidators()

    if (validators) dispatch(setValidators(validators))
  }
}

export function setValidators(validators: Array<any>): AppAction {
  let totalBonded = new BigNumber(0)

  for (let val of validators) {
    if (val.BondStatus === "bonded") totalBonded = totalBonded.plus(new BigNumber(val.Tokens))
  }

  return {
    type: AppActionsTypes.SET_VALIDATORS,
    validators: validators,
    totalBonded: totalBonded,
  }
}

export function refreshCoinsList(): AppThunk {
  return async function (dispatch) {
    // loading coins list
    const { data: coinsList } = await useCoinGeckoClient().get(constants.COINGECKO_API_COINS_LIST)

    if (coinsList) dispatch(setCoinsList(coinsList))
  }
}

export function setCoinsList(coinsList: any): AppAction {
  return {
    type: AppActionsTypes.SET_COINS_LIST,
    coins: coinsList,
  }
}

export function refreshStaking(): AppThunk {
  return async function (dispatch) {
    return new Promise(async (resolve) => {
      await dispatch(refreshTokens()) // refreshTokens order is mandatory
      await dispatch(refreshRewards())
      await dispatch(refreshBalance())
      await dispatch(refreshDelegations())
      resolve()
    })
  }
}

export function refreshRewards(): AppThunk {
  return async function (dispatch, getState) {
    const address = getState().app.appSettings.address
    if (!address) throw new Error("Address is not defined")

    // loading rewards
    const data = await useTradescanClient().getDelegatorDelegationRewards({ address: address })

    if (data?.result?.rewards) {
      const rewards = data.result.rewards
      dispatch(setRewards(rewards))
    }
  }
}

export function setRewards(rewards: any): AppAction {
  return {
    type: AppActionsTypes.SET_REWARDS,
    rewards: rewards,
  }
}

export function refreshDelegations(): AppThunk {
  return async function (dispatch, getState) {
    const address = getState().app.appSettings.address
    if (!address) throw new Error("Address is not defined")

    // loading delegations
    const data = await useTradescanClient().getDelegatorDelegations({ address: address })

    if (data?.result) {
      const delegations = data.result
      dispatch(setDelegations(delegations))
    }
  }
}

export function setDelegations(delegations: any): AppAction {
  return {
    type: AppActionsTypes.SET_DELEGATIONS,
    delegations: delegations,
  }
}

export function refreshBalance(): AppThunk {
  return async function (dispatch, getState) {
    const address = getState().app.appSettings.address
    if (!address) throw new Error("Address is not defined")

    // loading balance
    const balance = await useTradescanClient().getWalletBalance({ address: address })

    if (balance) dispatch(setBalance(balance))
  }
}

export function setBalance(balance: any): AppAction {
  return {
    type: AppActionsTypes.SET_BALANCE,
    balance: balance,
  }
}

export function refreshTokens(): AppThunk {
  return async function (dispatch) {
    // loading tokens
    const tokens = await useTradescanClient().getTokens()

    if (tokens) dispatch(setTokens(tokens))
  }
}

export function setTokens(tokens: any): AppAction {
  return {
    type: AppActionsTypes.SET_TOKENS,
    tokens: tokens,
  }
}

export function refreshDashboard(): AppThunk {
  return async function (dispatch) {
    return new Promise(async (resolve) => {
      await dispatch(refreshPrices(["swth"]))
      await dispatch(refreshSupply())
      await dispatch(refreshStakingPool()) // refreshStakingPool order is mandatory
      await dispatch(poolBlocks()) // pollBlocks order is mandatory
      await dispatch(refreshBlockTime())
      resolve()
    })
  }
}

export function refreshPrices(symbols: Array<string>): AppThunk {
  return async function (dispatch, getState) {
    const coinsList = getState().app.coins
    if (!coinsList) return

    const tokensIds: Array<string> = []
    for (let symbol of symbols) {
      const tokenId: string = Object.values<any>(coinsList).find((x: any) => x.symbol === symbol)?.id
      tokensIds.push(tokenId)
    }

    // loading price
    const { data: prices } = await useCoinGeckoClient().get(constants.COINGECKO_API_SIMPLE_PRICE_ENDPOINT.replace("{Ids}", tokensIds.join(",")))

    if (prices) {
      const newPrices = { ...getState().app.prices }
      for (const token in prices) {
        const tokenSymbol: string = Object.values<any>(coinsList).find((x: any) => x.id === token)?.symbol
        newPrices[tokenSymbol] = prices[token]
      }

      dispatch(setPrices(newPrices))
    }
  }
}

export function setPrices(prices: any): AppAction {
  return {
    type: AppActionsTypes.SET_PRICES,
    prices: prices,
  }
}

export function refreshSupply(): AppThunk {
  return async function (dispatch, getState) {
    // loading total supply
    const { data: totalSupply } = await useSwitcheoClient().get(constants.SWITCHEO_API_NATIVE_TOKEN_SUPPLY_ENDPOINT)

    if (totalSupply) {
      const swthPrice = getState().app.prices?.swth?.usd
      dispatch(setSupply(swthPrice, totalSupply))
    }
  }
}

export function setSupply(swthPrice: number, totalSupply: number): AppAction {
  return {
    type: AppActionsTypes.SET_SUPPLY,
    totalSupply: new BigNumber(totalSupply),
    mktCap: new BigNumber(swthPrice).times(totalSupply),
  }
}

export function refreshStakingPool(): AppThunk {
  return async function (dispatch) {
    // loading staking pool
    const data = await useTradescanClient().getStakingPool()

    if (data) dispatch(setStakingPool(data?.result))
  }
}

export function setStakingPool(stakingPool: StakingPool): AppAction {
  return {
    type: AppActionsTypes.SET_STAKING_POOL,
    totalStaked: new BigNumber(stakingPool.bonded_tokens).plus(new BigNumber(stakingPool.not_bonded_tokens)).shiftedBy(-8),
  }
}

export function poolBlocks(): AppThunk {
  return async function (dispatch) {
    // loading five last blocks
    const blocks = await useTradescanClient().getBlocks({ page: 1, limit: 5 })
    if (!blocks || blocks.length === 0) return

    dispatch(setBlocks(blocks))

    const lastBlock = blocks[0]

    let blockCount = new BigNumber(0)
    let totalRewards = new BigNumber(0)

    // loading last block events
    const { data: evts } = await useTendermintClient().get(`${constants.TENDERMINT_API_BLOCK_RESULTS_ENDPOINT}?height=${lastBlock.block_height}`)
    if (!evts?.result?.begin_block_events || evts?.result?.begin_block_events.length === 0) return

    for (let evt of evts.result.begin_block_events) {
      if (evt.type === "rewards") {
        for (let c of evt.attributes) {
          const key = Base64.atob(c.key)
          if (key === "amount") {
            const value = Base64.atob(c.value)
            if (value.substr(value.length - 4) === "swth") {
              totalRewards = totalRewards.plus(new BigNumber(value.substring(0, value.length - 4)).shiftedBy(-8))
            }
          }
        }
      }
    }

    blockCount = blockCount.plus(1)
    const avgReward = totalRewards.div(blockCount)
    dispatch(setAvgReward(avgReward))
  }
}

export function setBlocks(blocks: any): AppAction {
  return {
    type: AppActionsTypes.SET_BLOCKS,
    blocks: blocks,
  }
}

export function setAvgReward(avgReward: BigNumber): AppAction {
  return {
    type: AppActionsTypes.SET_AVG_REWARD,
    avgReward: avgReward,
  }
}

/**
 * Be sure to call at least one time refreshStakingPool, refreshValidators and pollBlocks before
 */
export function refreshBlockTime(): AppThunk {
  return async function (dispatch, getState) {
    // loading block time
    const blockTime = await useTradescanClient().getAverageBlocktime()

    const avgReward = getState().app.avgReward
    const totalBonded = getState().app.totalBonded

    dispatch(setBlockTime(blockTime, avgReward, totalBonded))
  }
}

export function setBlockTime(blockTime: string, avgReward: BigNumber, totalBonded: BigNumber): AppAction {
  const timeArray = blockTime.split(":")
  const hours = new BigNumber(timeArray[0]).times(60 * 60)
  const minutes = new BigNumber(timeArray[1]).times(60)
  const seconds = new BigNumber(timeArray[2])
  const blockTimeBN = hours.plus(minutes).plus(seconds)

  const blockTimeFormat = blockTimeBN.toFormat(constants.BLOCK_TIME_PRECISION)

  const blocksInYear = constants.SECONDS_IN_A_YEAR.div(blockTimeBN)
  const rewardsInYear = blocksInYear.times(avgReward)
  const apr = rewardsInYear.div(totalBonded)

  return {
    type: AppActionsTypes.SET_BLOCK_TIME,
    blockTime: blockTimeFormat,
    apr: apr.times(100).toFormat(2),
  }
}
