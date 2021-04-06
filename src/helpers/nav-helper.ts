import { constants } from "@src/constants"
import { Screen } from "@src/enums"

export function getRouteByScreen(screen: Screen) {
  switch (screen) {
    case Screen.Dashboard:
      return constants.SCREEN_HOME_DASHBOARD_ROUTE
    case Screen.Wallet:
      return constants.SCREEN_HOME_WALLET_ROUTE
    case Screen.Staking:
      return constants.SCREEN_HOME_STAKING_ROUTE
    default:
      return constants.SCREEN_HOME_ROUTE
  }
}
