import { useFocusEffect, useNavigation } from "@react-navigation/core"
import { constants, messages } from "@src/constants"
import { useRootSelector } from "@src/redux"
import { useMemo } from "react"
import { Alert } from "react-native"

export interface UseWalletArgs {
  warnIfNoWallet: boolean
}

export function useWallet(args: UseWalletArgs = { warnIfNoWallet: true }) {
  const { warnIfNoWallet } = args

  const address = useRootSelector((state) => state.app.appSettings.address)
  const hasWallet = useMemo(() => {
    return address !== null
  }, [address])

  if (warnIfNoWallet) {
    const navigation = useNavigation()

    useFocusEffect(() => {
      if (!hasWallet) {
        Alert.alert("Action required", messages.ACTION_REQUIRED_SET_ADDRESS, [
          {
            text: "Set my address",
            onPress: () => navigation.navigate(constants.SCREEN_SETTINGS_ROUTE),
          },
          {
            text: "Cancel",
            onPress: () => navigation.navigate(constants.SCREEN_HOME_DASHBOARD_ROUTE),
          },
        ])
      }
    })
  }

  return [address, hasWallet] as const
}
