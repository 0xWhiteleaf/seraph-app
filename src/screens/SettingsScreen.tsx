import { messages } from "@src/constants"
import { Screen } from "@src/enums"
import { useRootDispatch, useRootSelector } from "@src/redux"
import { updateAddress, updateLaunchScreen } from "@src/redux/modules/app/actions"
import * as Analytics from "expo-firebase-analytics"
import React, { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { Button, Caption, RadioButton, Subheading, Text, TextInput, useTheme } from "react-native-paper"

export function SettingsScreen() {
  const { colors } = useTheme()

  const dispatch = useRootDispatch()

  const address = useRootSelector((state) => state.app.appSettings?.address)
  const launchScreen = useRootSelector((state) => state.app.appSettings?.launchScreen)

  const [inputAddr, setInputAddr] = useState(address ?? "")

  const onUpdateAddress = async () => {
    if (inputAddr.startsWith("swth") && inputAddr.length === 43) {
      await dispatch(updateAddress(inputAddr))
      Alert.alert("Success", messages.SUCCESS_ADDRESS_UPDATED)

      // analytics
      Analytics.logEvent("set_address", { address: address })
      Analytics.setUserId(address)
    } else {
      Alert.alert("Error", messages.ERROR_INVALID_ADDRESS, [
        {
          text: "Retry",
        },
      ])
    }
  }

  const [screens, setScreens] = useState([
    { name: Screen.Dashboard, isLaunchScreen: false },
    { name: Screen.Wallet, isLaunchScreen: false },
    { name: Screen.Staking, isLaunchScreen: false },
  ])

  const _setSelectedScreen = (name: Screen) => {
    let _screens = [...screens]
    const launchScreenIndex = _screens.findIndex((x) => x.name === name)

    for (const [screenIndex, screen] of _screens.entries()) {
      if (screenIndex === launchScreenIndex) screen.isLaunchScreen = true
      else screen.isLaunchScreen = false
    }

    setScreens(_screens)
  }

  useEffect(() => {
    _setSelectedScreen(launchScreen ?? Screen.Dashboard)
  }, [])

  const onLaunchScreenSelected = async (selectedScreen: Screen) => {
    dispatch(updateLaunchScreen(selectedScreen))
    _setSelectedScreen(selectedScreen)
  }

  return (
    <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.accountSettingsWrapper}>
        <Subheading>Account</Subheading>

        <TextInput label="Your address" value={inputAddr} onChangeText={(addr) => setInputAddr(addr)} style={styles.addrInput} />
        <Button mode="contained" onPress={() => onUpdateAddress()} style={styles.updateAddrBtn}>
          Update address
        </Button>
      </View>

      <View style={styles.appSettingsWrapper}>
        <Subheading>Application</Subheading>

        <View style={styles.launchScreenWrapper}>
          <Caption>Launch Screen</Caption>

          {screens.map((screen) => (
            <View style={styles.radioBtnWithLabelWrapper} key={screen.name}>
              <RadioButton
                value={Screen[screen.name]}
                status={screen.isLaunchScreen ? "checked" : "unchecked"}
                onPress={() => onLaunchScreenSelected(screen.name)}
              />
              <Text style={styles.radioBtnLabel}>{Screen[screen.name]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.defaultCurrencyWrapper}>
        <Caption>Default Currency</Caption>
        <View style={styles.radioBtnWithLabelWrapper}>
          <RadioButton value="USD" status={"checked"} />
          <Text style={styles.radioBtnLabel}>USD</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  accountSettingsWrapper: {
    flex: 1,
    alignItems: "flex-start",
  },
  addrInput: {
    marginTop: 8,
    width: "100%",
  },
  updateAddrBtn: {
    marginTop: 12,
    padding: 4,
    width: "100%",
  },
  appSettingsWrapper: {
    marginTop: 22,
  },
  launchScreenWrapper: {},
  radioBtnWithLabelWrapper: {
    flex: 1,
    flexDirection: "row",
    textAlign: "center",
  },
  radioBtnLabel: {
    flex: 1,
    alignSelf: "center",
    paddingBottom: 4,
  },
  defaultCurrencyWrapper: {
    marginTop: 11,
  },
})
