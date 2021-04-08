import { constants } from "@src/constants"
import { getShiftedAmount } from "@src/helpers"
import { useWallet } from "@src/hooks"
import { useRootDispatch, useRootSelector } from "@src/redux"
import { refreshPrices, refreshStaking } from "@src/redux/modules"
import BigNumber from "bignumber.js"
import React, { useEffect, useMemo, useState } from "react"
import { Image, RefreshControl, ScrollView, StyleSheet, View } from "react-native"
import { Caption, DataTable, Subheading, Text, Title, useTheme } from "react-native-paper"

export function WalletScreen() {
  const dispatch = useRootDispatch()

  const [address, hasWallet] = useWallet()

  const balances = useRootSelector((state) => state.app.balances)
  const delegations = useRootSelector((state) => state.app.delegations)
  const tokens = useRootSelector((state) => state.app.tokens)

  const [refreshing, setRefreshing] = useState(false)

  const _refreshWallet = async () => {
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
    _refreshWallet
  }

  useEffect(() => {
    if (hasWallet) {
      _refreshWallet()
    }
  }, [hasWallet])

  // wallet format
  const walletFormat = useMemo(() => {
    let wallet: Array<any> = []

    if (!balances || !delegations) return wallet

    for (let denom of Object.keys(balances)) {
      const balance = balances[denom]

      const denomToken = tokens.find((x) => x.denom === denom)
      const symbol = denomToken.symbol.toUpperCase()

      // ignoring swth-n and lp tokens
      if (symbol === "SWTHN" || symbol.includes("-LP")) continue

      let available = new BigNumber(balance.available)
      let order = new BigNumber(balance.order)
      let position = new BigNumber(balance.position)

      wallet.push({
        symbol,
        available,
        order,
        position,
        staked: new BigNumber(0),
      })
    }

    for (let delegation of delegations) {
      const denom = delegation.balance.denom
      let amount = new BigNumber(delegation.balance.amount)

      const denomToken = tokens.find((x) => x.denom === denom)
      amount = getShiftedAmount(denomToken.blockchain, amount)

      const walletTokenIndex = wallet.findIndex((x) => x.symbol === denomToken.symbol.toUpperCase())
      if (walletTokenIndex !== -1) wallet[walletTokenIndex].staked = wallet[walletTokenIndex].staked.plus(amount)
    }

    for (let i = 0; i < wallet.length; i++) {
      const balance = wallet[i]
      const denomToken = tokens.find((x) => x.symbol === balance.symbol)

      wallet[i].total = balance.available.plus(balance.order.plus(balance.position.plus(balance.staked)))
      wallet[i].totalFormat = balance.total.toFormat(denomToken?.decimals ?? 8)
    }

    // sorting desc
    wallet = wallet.sort((a, b) => a.total.toNumber() - b.total.toNumber()).reverse()

    return wallet
  }, [balances, delegations])

  // fiat value
  useEffect(() => {
    const tokensSymbols = walletFormat.map((x) => x.symbol.toLowerCase())
    if (!tokensSymbols || tokensSymbols.length === 0) return

    dispatch(refreshPrices(tokensSymbols))
  }, [walletFormat])

  const prices = useRootSelector((state) => state.app.prices)
  const [fiatValue, setFiatValue] = useState<string | null>(null)

  useEffect(() => {
    let fiatValue: BigNumber = new BigNumber(0.0)

    for (let balance of walletFormat) {
      const rewardAmount = new BigNumber(balance.total)
      const rewardPrice = prices[balance?.symbol?.toLowerCase()]?.usd ?? 0
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

      <View style={styles.tableWrapper}>
        <Title>Wallet Balance{fiatValue !== null && <Subheading> — ${fiatValue}</Subheading>}</Title>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Asset</DataTable.Title>
            <DataTable.Title numeric>Balance</DataTable.Title>
          </DataTable.Header>

          {walletFormat.map((balance) => (
            <DataTable.Row key={balance.symbol}>
              <View style={styles.tokenCell}>
                {constants.TOKENS_LOGOS[balance.symbol] && (
                  <Image
                    style={styles.tokenLogo}
                    source={{
                      uri: constants.TOKENS_LOGOS[balance.symbol],
                    }}
                  />
                )}
                <Text>{balance.symbol}</Text>
              </View>
              <DataTable.Cell numeric>{balance.totalFormat}</DataTable.Cell>
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
