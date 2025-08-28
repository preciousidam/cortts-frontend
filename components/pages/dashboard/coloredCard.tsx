import { Typography } from "@/components/typography";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoundness } from "@/styleguide/theme/Border";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  backgroundColor?: string;
  iconBgColor?: string;
};

export const StatCard = ({ title, value, icon, backgroundColor, iconBgColor }: StatCardProps) => {
  const styles = useStyles();
  return (
    <View style={[styles.card, backgroundColor && { backgroundColor }]}>
      <View style={styles.header}>
        <Typography variant='semiBold' size='caption'>
          {title}
        </Typography>
        <View style={[styles.icon, iconBgColor && { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
      </View>
      <Typography variant='semiBold' size='subtitle'>
        {value}
      </Typography>
    </View>
  );
}

const useStyles = () => {
  const { isMobile, widthPixel, heightPixel, fontPixel } = useResponsive();
  const roundness = useRoundness();
  const { colors, shadow } = useTheme();

  return useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: heightPixel(32),
      paddingHorizontal: widthPixel(32)
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    card: {
      width: widthPixel(258),
      height: heightPixel(116),
      paddingHorizontal: widthPixel(12),
      paddingVertical: heightPixel(12),
      rowGap: heightPixel(21),
      ...roundness.m,
      borderColor: '#E5E5E5',
      ...shadow(heightPixel(2), widthPixel(8))
    },
    icon: {
      width: widthPixel(34),
      height: heightPixel(34),
      justifyContent: 'center',
      alignItems: 'center',
      ...roundness.m
    }
  }), [widthPixel, heightPixel, fontPixel, isMobile]);
}