import React from "react"
import { Text } from "react-native"
import * as Linking from "expo-linking"
import { useTheme } from "react-native-paper"

export interface AnchorProps extends React.HTMLAttributes<HTMLDivElement> {
 href: string
 onPress?: Function
}

export function Anchor({ href, onPress, ...props }: React.PropsWithChildren<AnchorProps>) {
 const { colors } = useTheme()

 const _handlePress = () => {
  Linking.openURL(href)
  onPress && onPress()
 }

 return (
  <Text style={{ color: colors.links }} {...props} onPress={_handlePress}>
   {props.children}
  </Text>
 )
}
