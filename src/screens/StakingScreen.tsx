import { constants } from "@src/constants"
import { getShiftedAmount } from "@src/helpers"
import { useWallet } from "@src/hooks"
import { useRootDispatch, useRootSelector } from "@src/redux"
import { refreshPrices, refreshStaking } from "@src/redux/modules"
import BigNumber from "bignumber.js"
import React, { useEffect, useMemo, useState } from "react"
import { Image, RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import { Caption, DataTable, Subheading, Text, Title, useTheme } from "react-native-paper"

export function StakingScreen() {
  const dispatch = useRootDispatch()

  const [address, hasWallet] = useWallet()

  const validators = useRootSelector((state) => state.app.validators)
  const delegations = useRootSelector((state) => state.app.delegations)
  const rewards = useRootSelector((state) => state.app.rewards)
  const tokens = useRootSelector((state) => state.app.tokens)

  const [refreshing, setRefreshing] = useState(false)

  const _refreshStaking = async () => {
    setRefreshing(true)

    dispatch(refreshStaking())
      .then(() => {
        setRefreshing(false)
      })
      .catch(() => {
        // TODO: Toast...
        setRefreshing(false)
      })
  }

  const onRefresh = () => {
    _refreshStaking()
  }

  useEffect(() => {
    if (hasWallet) {
      _refreshStaking()
    }
  }, [hasWallet])

  // delegations format
  const delegationsFormat = useMemo(() => {
    let delegationsFormat: Array<any> = []

    for (let delegation of delegations) {
      const validatorAddr = delegation.validator_address
      const validator = validators.find((x) => x.OperatorAddress === validatorAddr).Description.moniker ?? "Unknown"

      const denom = delegation.balance.denom

      let amount = new BigNumber(delegation.balance.amount)
      if (!amount.comparedTo(0)) continue
      if (denom === "swth") amount = amount.shiftedBy(-8)

      delegationsFormat.push({
        validator,
        staked: amount.toFormat(4),
      })
    }

    return delegationsFormat
  }, [delegations])

  // rewards format
  const rewardsFormat = useMemo(() => {
    let valRewards: Array<any> = []

    for (let reward of rewards) {
      const validatorAddr = reward.validator_address
      const validator = validators.find((x) => x.OperatorAddress === validatorAddr).Description.moniker ?? "Unknown"

      const validatorRewards = reward.reward
      if (!validatorRewards) continue

      for (let validatorReward of validatorRewards) {
        const denom = validatorReward.denom
        let amount = new BigNumber(validatorReward.amount)

        valRewards.push({
          validator,
          amount,
          denom,
        })
      }
    }

    let totalRewards: Array<any> = []

    const valRewardsDenoms = [...new Set(valRewards.map((x) => x.denom))]
    for (let denom of valRewardsDenoms) {
      const denomRewards = valRewards.filter((x) => x.denom === denom)
      let totalDenomRewards = new BigNumber(0.0)
      for (let reward of denomRewards) {
        totalDenomRewards = totalDenomRewards.plus(reward.amount)
      }

      const denomToken = tokens.find((x) => x.denom === denom)
      totalDenomRewards = getShiftedAmount(denomToken.blockchain, totalDenomRewards)

      const totalDenomRewardsFormat = totalDenomRewards.toFormat(denomToken.decimals)

      totalRewards.push({
        symbol: denomToken.symbol.toUpperCase(),
        amountFormat: totalDenomRewardsFormat,
        amount: totalDenomRewards,
      })
    }

    // sorting desc
    totalRewards = totalRewards.sort((a, b) => a.amount.toNumber() - b.amount.toNumber()).reverse()

    return totalRewards
  }, [rewards])

  // fiat value
  useEffect(() => {
    const tokensSymbols = rewardsFormat.map((x) => x.symbol.toLowerCase())
    if (!tokensSymbols || tokensSymbols.length === 0) return

    dispatch(refreshPrices(tokensSymbols))
  }, [rewardsFormat])

  const prices = useRootSelector((state) => state.app.prices)
  const [fiatValue, setFiatValue] = useState<string | null>(null)

  useEffect(() => {
    let fiatValue: BigNumber = new BigNumber(0.0)

    for (let rewardFormat of rewardsFormat) {
      const rewardAmount = new BigNumber(rewardFormat.amount)
      const rewardPrice = prices[rewardFormat?.symbol?.toLowerCase()]?.usd ?? 0
      fiatValue = fiatValue.plus(rewardAmount.times(rewardPrice))
    }

    setFiatValue(fiatValue.toFormat(2))
  }, [prices])

  const { colors } = useTheme()

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.addressWrapper}>
        <Subheading>Your address</Subheading>
        <Caption>{address ?? "No address"}</Caption>
      </View>

      <View style={[styles.tableWrapper, { marginTop: 6 }]}>
        <Title>Staked Balance</Title>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Validator</DataTable.Title>
            <DataTable.Title numeric>Staked Amount</DataTable.Title>
          </DataTable.Header>

          {delegationsFormat.map((delegation) => (
            <DataTable.Row key={delegation.validator}>
              <DataTable.Cell>{delegation.validator}</DataTable.Cell>
              <DataTable.Cell numeric>{delegation.staked}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>

      <View style={[styles.tableWrapper, { marginTop: 20 }]}>
        <Title>Staking Rewards{fiatValue !== null && <Subheading> — ${fiatValue}</Subheading>}</Title>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Reward Token</DataTable.Title>
            <DataTable.Title numeric>Amount</DataTable.Title>
          </DataTable.Header>

          {rewardsFormat.map((reward) => (
            <DataTable.Row key={reward.symbol}>
              <View style={styles.tokenCell}>
                {constants.TOKENS_LOGOS[reward.symbol] && (
                  <Image
                    style={styles.tokenLogo}
                    source={{
                      uri: constants.TOKENS_LOGOS[reward.symbol],
                    }}
                  />
                )}
                <Text>{reward.symbol}</Text>
              </View>
              <DataTable.Cell numeric>{reward.amountFormat}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 8,
  },
  addressWrapper: {
    flex: 1,
    alignItems: "center",
    marginBottom: 0,
  },
  tableWrapper: {
    flex: 1,
    marginTop: 12,
  },
  tokenCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  tokenLogo: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
})
