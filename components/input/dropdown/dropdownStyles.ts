import { useResponsive } from "@/hooks/useResponsive";
import { useRoundness } from "@/styleguide/theme/Border";
import { generateColorScale } from "@/styleguide/theme/Colors";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { ReactNode } from "react";
import { ValidationRule } from "react-hook-form";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";

export type DropdownOption = {
  label: string;
  value: string;
};

export type BaseDropdownProps = {
  label?: string;
  placeholder?: string;
  options?: DropdownOption[];
  selectedValues?: string[];
  onSelect?: (selected: string[]) => void;
  multiSelect?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  icon_position?: 'left' | 'right';
  isSearchable?: boolean;
  required?: string | boolean | ValidationRule<boolean>;
  error?: string;
  info?: string;
  anchor?: (props: {value: string, ref: (node: any) => void, onPress: () => void}) => ReactNode;
};

export const useDropdownStyles = () => {
  const { scale, verticalScale, fontPixel } = useResponsive();
  const roundness = useRoundness();
  const { colors, fonts, shadow } = useTheme();

  return StyleSheet.create({
    label: {
      marginBottom: verticalScale(4),
    },
    selector: {
      // paddingVertical: verticalScale(10),
      flexDirection: 'row',
      columnGap: scale(12),
      alignItems: 'center',
      ...roundness.m,
      height: verticalScale(44)
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#00000070',
      justifyContent: 'flex-end',
    },
    modalContent: {
      paddingVertical: verticalScale(12),
      ...roundness.m,
      borderColor: colors.border,
      ...shadow(verticalScale(2), scale(8))
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(12),
      marginBottom: 16,
      width: '100%',
      paddingHorizontal: scale(16)
    },
    searchInput: {
      borderWidth: 1,
      borderRadius: scale(8),
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(6),
      ...fonts.medium,
      width: '100%'
    },
    option: {
      paddingVertical: verticalScale(10),
      paddingHorizontal: scale(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selected: {
      backgroundColor: '#F5FBFF',
      borderLeftWidth: scale(4),
      borderLeftColor: colors.primary
    },
    optionText: {
    },
    leftIconView: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: generateColorScale(colors.neutral).lightActive,
      borderTopLeftRadius: verticalScale(8),
      borderBottomLeftRadius: verticalScale(8),
      borderRightColor: generateColorScale(colors.neutral).normalBase,
      borderRightWidth: scale(.7),
      height: '100%',
      zIndex: -1
    },
    rightIconView: {
      paddingHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: generateColorScale(colors.neutral).lightActive,
      borderTopRightRadius: verticalScale(8),
      borderBottomRightRadius: verticalScale(8),
      borderLeftColor: generateColorScale(colors.neutral).normalBase,
      borderLeftWidth: scale(.7),
      height: '100%',
      zIndex: -1
    },
    paddingLeft: {
      paddingLeft: scale(12)
    },
    paddingRight: {
      paddingRight: scale(12)
    },
    sb: {
      columnGap: scale(4),
      flexDirection: 'row',
    },
    required: {
      color: colors.notification,
      fontSize: fontPixel(12),
    },
    errorText: {
      color: colors.notification,
      fontSize: fontPixel(12),
      ...fonts.regular,
    },
    infoText: {
      color: colors.neutral,
      fontSize: fontPixel(12),
    }
  });
}