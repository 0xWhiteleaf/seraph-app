import React from "react";
import { StyleSheet } from "react-native";
import { Card, Title, Text, Caption } from "react-native-paper";

export interface DashboardCardProps {
  style?: any;
  title: string;
  value: string;
  caption: string;
}

export function DashboardCard({
  style,
  title,
  value,
  caption,
}: DashboardCardProps) {
  return (
    <Card style={style}>
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        <Text style={styles.text}>{value}</Text>
        <Caption style={styles.caption}>{caption}</Caption>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  text: {
    paddingTop: 4,
    textAlign: "center",
    fontSize: 22,
  },
  caption: {
    textAlign: "center",
  },
});
