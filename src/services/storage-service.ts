import AsyncStorage from "@react-native-async-storage/async-storage"
import { constants } from "@src/constants"
import { Screen } from "@src/enums"
import { AppSettings } from "@src/models"

export async function getAddress(): Promise<string | null> {
  const storedAddress = await AsyncStorage.getItem(constants.STORAGE_KEY_ADDRESS)
  if (!storedAddress) return null

  return storedAddress
}

export async function saveAddress(address: string): Promise<void> {
  await AsyncStorage.setItem(constants.STORAGE_KEY_ADDRESS, address)
}

export async function getLaunchScreen(): Promise<Screen | null> {
  const storedLaunchScreen = await AsyncStorage.getItem(constants.STORAGE_KEY_LAUNCH_SCREEN)
  if (!storedLaunchScreen) return null

  return Screen[storedLaunchScreen as keyof typeof Screen]
}

export async function saveLaunchScreen(launchScreen: Screen): Promise<void> {
  await AsyncStorage.setItem(constants.STORAGE_KEY_LAUNCH_SCREEN, Screen[launchScreen])
}

export async function getAppSettings(): Promise<AppSettings> {
  return {
    address: await getAddress(),
    launchScreen: await getLaunchScreen() ?? Screen.Dashboard,
  }
}
