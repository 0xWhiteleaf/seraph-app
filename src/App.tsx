import * as Analytics from "expo-firebase-analytics"
import { StatusBar } from "expo-status-bar"
import React, { useRef, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { DarkTheme, Provider as PaperProvider, Appbar, useTheme } from "react-native-paper"
import { StyleSheet, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { DashboardScreen } from "@src/screens/DashboardScreen"
import { StakingScreen } from "@src/screens/StakingScreen"
import { AboutScreen } from "@src/screens/AboutScreen"
import { Provider } from "react-redux"
import { store, useRootDispatch, useRootSelector } from "@src/redux"
import { SettingsScreen } from "./screens/SettingsScreen"
import { constants } from "./constants"
import AppLoading from "expo-app-loading"
import { getAppSettings } from "./services/storage-service"
import { refreshCoinsList, refreshValidators, setAppSettings } from "./redux/modules/app/actions"
import { WalletScreen } from "./screens/WalletScreen"
import { getRouteByScreen } from "./helpers"
import { useWallet } from "./hooks"

const Tab = createMaterialBottomTabNavigator()

function HomeTabs() {
  const launchScreen = useRootSelector((state) => state.app.appSettings.launchScreen)
  const initialRouteName = getRouteByScreen(launchScreen)

  const { colors } = useTheme()

  return (
    <Tab.Navigator barStyle={{ backgroundColor: colors.surface }} initialRouteName={initialRouteName}>
      <Tab.Screen
        name={constants.SCREEN_HOME_DASHBOARD_ROUTE}
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={constants.SCREEN_HOME_WALLET_ROUTE}
        component={WalletScreen}
        options={{
          tabBarLabel: "Wallet",
          tabBarIcon: ({ color }) => <Ionicons name="wallet" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={constants.SCREEN_HOME_STAKING_ROUTE}
        component={StakingScreen}
        options={{
          tabBarLabel: "Staking",
          tabBarIcon: ({ color }) => <Ionicons name="trending-up" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={constants.SCREEN_HOME_ABOUT_ROUTE}
        component={AboutScreen}
        options={{
          tabBarLabel: "About",
          tabBarIcon: ({ color }) => <Ionicons name="information" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator()

function AppLoadingWrapper(props: any) {
  const { setIsReady } = props

  const dispatch = useRootDispatch()

  const [address, hasWallet] = useWallet({ warnIfNoWallet: false });

  const startAsync = async () => {
    const appSettings = await getAppSettings()
    dispatch(setAppSettings(appSettings))

    await dispatch(refreshValidators())
    await dispatch(refreshCoinsList())

    // analytics
    if (hasWallet)
      Analytics.setUserId(address);
  }
  
  return <AppLoading startAsync={startAsync} onFinish={() => setIsReady(true)} onError={console.warn} />
}

export default function App() {
  const [isReady, setIsReady] = useState(false)

  const navigationRef = useRef<any>()
  const routeNameRef = useRef<any>()

  return (
    <Provider store={store}>
      {!isReady ? (
        <AppLoadingWrapper setIsReady={setIsReady} />
      ) : (
        <PaperProvider theme={theme}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => (routeNameRef.current = navigationRef.current.getCurrentRoute().name)}
            onStateChange={async () => {
              const previousRouteName = routeNameRef.current
              const currentRouteName = navigationRef.current.getCurrentRoute().name

              if (previousRouteName !== currentRouteName) await Analytics.setCurrentScreen(currentRouteName)

              routeNameRef.current = currentRouteName
            }}>
            <StatusBar style="light" />

            <Stack.Navigator
              headerMode="screen"
              screenOptions={{
                header: ({ navigation, scene, previous }) => (
                  <Appbar.Header>
                    {previous && <Appbar.BackAction onPress={() => navigation.goBack()} />}
                    {!previous && <Image style={styles.appBarLogo} source={require("./assets/icon.png")} />}
                    <Appbar.Content style={!previous && styles.appBarTitle} title={scene.descriptor.options.title ?? "Seraph"} />
                    {scene.route.name !== constants.SCREEN_SETTINGS_ROUTE && (
                      <Appbar.Action icon="cog" onPress={() => navigation.push(constants.SCREEN_SETTINGS_ROUTE)} />
                    )}
                  </Appbar.Header>
                ),
              }}>
              <Stack.Screen name={constants.SCREEN_HOME_ROUTE} component={HomeTabs} />
              <Stack.Screen name={constants.SCREEN_SETTINGS_ROUTE} component={SettingsScreen} options={{ title: "Settings" }} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      )}
    </Provider>
  )
}

const styles = StyleSheet.create({
  appBarTitle: {
    marginLeft: 0,
  },
  appBarLogo: {
    marginLeft: 6,
    width: 38,
    height: 38,
  },
})

const theme = {
  ...DarkTheme,
  roundness: 10,
  colors: {
    ...DarkTheme.colors,
    links: "#1976d2",
  },
  /*
  colors: {
    ...DefaultTheme.colors,
    primary: '#202b3f',
    accent: '#6F758C',
    background: '#20273a',
    surface: '#283349',
    text: '#ffffff'
  },
  */
}
