import { useResponsive } from "@/hooks/useResponsive";
import { useRoundness } from "@/styleguide/theme/Border";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { StyleSheet } from "react-native";

export const useTableStyles = () => {
  const { widthPixel, heightPixel, fontPixel } = useResponsive();
  const roundness = useRoundness();
  const { colors } = useTheme();
  return StyleSheet.create({
    tableWrapper: {
      rowGap: heightPixel(8),
      width: '100%'
    },
    tableContent: {
      ...roundness.m,
      borderColor: colors.neutral.lightActive,
      backgroundColor: colors.card,
      // minWidth: '100%',
    },
    headerRow: {
      // width: '100%',
    },
    headerCell: {
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(20)
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      // width: '100%',
      // zIndex: -1,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral.lightActive
    },
    cell: {
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(16),
      flex: 1
    },
    headerText: {
      color: colors.text.weak,
      fontSize: fontPixel(14),
    },
    bodyText: {
      color: colors.text.default,
      fontSize: fontPixel(13),
    },
    body: {
    },
    headerAction: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    search: {
      width: widthPixel(404)
    },
    filter: {
      width: widthPixel(200)
    },
    emptyView: {
      width: '100%',
      height: heightPixel(764),
      justifyContent: 'center',
      alignItems: 'center',
      ...roundness.m,
      borderColor: colors.neutral.lightActive,
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