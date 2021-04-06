import React, { useEffect, useMemo, useState } from "react"
import { useTheme } from "react-native-paper"
import { StyleSheet, Dimensions, RefreshControl } from "react-native"
import { View, ScrollView } from "react-native"
import { DashboardCard } from "@src/components/DashboardCard"
import { useRootDispatch, useRootSelector } from "@src/redux"
import { refreshDashboard } from "@src/redux/modules/app/actions"
import BigNumber from "bignumber.js"

export function DashboardScreen() {
  const { colors } = useTheme()
  const scrollViewBgColor = { backgroundColor: colors.background }

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    _refreshDashboard()
  }

  const dispatch = useRootDispatch()

  const swthPrice = useRootSelector((state) => state.app.prices?.swth?.usd)
  const mktCap = useRootSelector((state) => state.app.mktCap)?.toFormat(0)
  const blockTime = useRootSelector((state) => state.app.blockTime)
  const apr = `${useRootSelector((state) => state.app.apr)}%`
  const totalSupply = useRootSelector((state) => state.app.totalSupply)
  const totalStaked = useRootSelector((state) => state.app.totalStaked)
  const validators = useRootSelector((state) => state.app.validators)

  const bondedPercent = useMemo(() => {
    return totalStaked.div(totalSupply).isFinite() ? totalStaked.div(totalSupply).times(100) : new BigNumber(0)
  }, [totalStaked])

  const bondedPercentFormat = `${bondedPercent.toFormat(2)}%`
  const totalStakedFormat = `${totalStaked.toFormat(0)} SWTH`

  const activeValidators = useMemo(() => {
    return validators.filter((x) => x.BondStatus === "bonded")
  }, [validators])

  const activeValidatorsFormat = `${activeValidators.length} / ${validators.length}`

  const _refreshDashboard = async () => {
    setRefreshing(true)

    dispatch(refreshDashboard())
      .then(() => {
        setRefreshing(false)
      })
      .catch(() => {
        // TODO: Toast...
        setRefreshing(false)
      })
  }

  useEffect(() => {
    _refreshDashboard()
  }, [])

  return (
    <ScrollView
      style={[styles.scrollView, scrollViewBgColor]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.cardsWrapper}>
        <DashboardCard title="Price" value={swthPrice} caption="dollars" style={styles.cards} />
        <DashboardCard title="Market Cap" value={mktCap} caption="dollars" style={styles.cards} />
        {/*
          <DashboardCard
            title="Volume 24H"
            value="0"
            caption="dollars"
            style={styles.cards}
          />
          <DashboardCard
            title="Insurance"
            value="0"
            caption="dollars"
            style={styles.cards}
          />
          */}
        <DashboardCard title="Block Time" value={blockTime} caption="seconds" style={[styles.cards, styles.alternateCards]} />
        <DashboardCard title="Staking APR" value={apr} caption="estimated" style={[styles.cards, styles.alternateCards]} />
        <DashboardCard title="Bonded" value={bondedPercentFormat} caption={totalStakedFormat} style={[styles.cards, styles.alternateCards]} />
        <DashboardCard
          title="Active Validators"
          value={activeValidators.length.toString()}
          caption={activeValidatorsFormat}
          style={[styles.cards, styles.alternateCards]}
        />
      </View>
    </ScrollView>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 8,
  },
  cardsWrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cards: {
    margin: 6,
    flexBasis: width * 0.5 - 20,
  },
  alternateCards: {
    flexBasis: width - 28,
  },
})
