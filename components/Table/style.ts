import { useResponsive } from "@/hooks/useResponsive";
import { useRoundness } from "@/styleguide/theme/Border";
import { generateColorScale } from "@/styleguide/theme/Colors";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { StyleSheet } from "react-native";

export const useTableStyles = () => {
  const { widthPixel, heightPixel, fontPixel } = useResponsive();
  const roundness = useRoundness();
  const { colors } = useTheme();
  return StyleSheet.create({
    tableWrapper: {
      // width: widthPixel(1104),
      rowGap: heightPixel(8)
    },
    tableContent: {
      ...roundness.m,
      borderColor: generateColorScale(colors.neutral).lightActive,
      backgroundColor: colors.card
    },
    headerRow: {
      width: '100%',
    },
    headerCell: {
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(20)
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      zIndex: -1,
      borderBottomWidth: 1,
      borderBottomColor: generateColorScale(colors.neutral).lightActive
    },
    cell: {
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(16),
    },
    headerText: {
      color: colors.textWeak,
      fontSize: fontPixel(14),
    },
    bodyText: {
      color: colors.text,
      fontSize: fontPixel(13),
    },
    body: {
    },
    headerAction: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    search: {
      width: widthPixel(404)
    },
    filter: {
      width: widthPixel(200)
    },
    emptyView: {
      width: widthPixel(1104),
      height: heightPixel(764),
      justifyContent: 'center',
      alignItems: 'center',
      ...roundness.m,
      borderColor: generateColorScale(colors.neutral).lightActive,
      backgroundColor: colors.card,
      rowGap: heightPixel(22)
    },
    emptyImage: {
      width: widthPixel(111),
      height: widthPixel(109),
    },
    hover: {
      backgroundColor: '#EDF9FF',
    },
    footer: {
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(16),
      alignItems: 'flex-end',
    }
  });
};