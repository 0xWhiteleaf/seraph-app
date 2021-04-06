import React from "react";
import {
  useTheme,
  Headline,
  Button,
  Paragraph,
} from "react-native-paper";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, ScrollView, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Color from "color";
import { Anchor } from "@src/components/Anchor";
import { constants } from "@src/constants";
import * as Linking from "expo-linking";

export function AboutScreen() {
  const { colors } = useTheme();
  const linksButtonBgColor = {
    backgroundColor: Color(colors.surface).lighten(1.4).hex(),
  };

  const openUrl = (href: string) => {
    Linking.openURL(href);
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.logoWrapper}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>

      <View style={styles.linksWrapper}>
        <TouchableOpacity
          style={[styles.linksButton, linksButtonBgColor]}
          onPress={() => openUrl(constants.SERAPH_WEBSITE_LINK)}
        >
          <FontAwesome5 name="link" size={22} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.linksButton, linksButtonBgColor]}
          onPress={() => openUrl(constants.SERAPH_TELEGRAM_LINK)}
        >
          <FontAwesome5 name="telegram-plane" size={22} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.linksButton, linksButtonBgColor]}
          onPress={() => openUrl(constants.SERAPH_DISCORD_LINK)}
        >
          <FontAwesome5 name="discord" size={22} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.linksButton, linksButtonBgColor]}
          onPress={() => openUrl(constants.SERAPH_KEYBASE_LINK)}
        >
          <FontAwesome5 name="keybase" size={22} color={"white"} />
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionWrapper}>
        <Paragraph style={styles.descriptionText}>
          This application was developed and made available to the Switcheo
          community by{" "}
          <Anchor href={constants.SERAPH_WEBSITE_LINK}>
            Seraph Staking <FontAwesome5 name="external-link-alt" size={12} />
          </Anchor>
          .
        </Paragraph>
      </View>

      <View style={styles.supportWrapper}>
        <Headline>
          Want to support us{" "}
          <FontAwesome5 name="hand-holding-heart" size={22} /> ?
        </Headline>
        <Paragraph style={styles.supportText}>
          The easiest way to support us is to dedicate a part of your stake to
          the Seraph Staking validator!
        </Paragraph>
        <Button
          style={styles.supportBtn}
          mode="contained"
          onPress={() => openUrl(`${constants.SERAPH_WEBSITE_LINK}/#stake`)}
        >
          Stake 🖤
        </Button>
      </View>

      <View style={styles.ackWrapper}>
        <Headline>
          Acknowledgements <FontAwesome5 name="hand-spock" size={22} />
        </Headline>
        <Paragraph style={styles.ackText}>
          Guardians of TradeHub (Gian Wick){"\n"}
          Devel & Co (Coco, Devel484)
        </Paragraph>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 8,
  },
  logoWrapper: {
    paddingTop: 12,
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 136,
    height: 136,
  },
  linksWrapper: {
    paddingTop: 12,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  linksButton: {
    width: 56,
    height: 56,
    borderRadius: 56,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionWrapper: {
    paddingTop: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionText: {
    maxWidth: 300,
    textAlign: "center",
  },
  supportWrapper: {
    paddingTop: 10,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  supportText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  supportBtn: {
    marginTop: 14,
    width: 185,
    padding: 6,
    borderRadius: 24,
  },
  ackWrapper: {
    paddingTop: 4,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  ackText: {
    textAlign: "center",
  },
});
