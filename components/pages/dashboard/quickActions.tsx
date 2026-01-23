import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { useResponsive } from "@/hooks/useResponsive";

type Action = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export const QuickActions: React.FC<{ actions: Action[] }> = ({ actions }) => {
  const { colors, fonts } = useTheme();
  const { widthPixel, heightPixel, fontPixel } = useResponsive();

  const styles = StyleSheet.create({
    grid: {
      paddingHorizontal: widthPixel(20),
      flexDirection: "row",
      flexWrap: "wrap",
      gap: widthPixel(12),
    },
    item: {
      width: "48%",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.neutral.light,
      borderRadius: widthPixel(16),
      padding: widthPixel(14),
      flexDirection: "row",
      alignItems: "center",
      columnGap: widthPixel(12),
      elevation: 1,
      shadowColor: "#aaa",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    iconWrap: {
      height: heightPixel(36),
      width: heightPixel(36),
      borderRadius: heightPixel(18),
      backgroundColor: "#EFF1F4",
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      ...fonts.medium,
      fontSize: fontPixel(13),
      color: colors.text.default,
    },
  });

  return (
    <View style={styles.grid}>
      {actions.map((a) => (
        <Pressable key={a.key} style={styles.item} onPress={a.onPress}>
          <View style={styles.iconWrap}>
            <Ionicons name={a.icon} size={fontPixel(18)} color={colors.text.default} />
          </View>
          <Text style={styles.label}>{a.label}</Text>
        </Pressable>
      ))}
    </View>
  );
};