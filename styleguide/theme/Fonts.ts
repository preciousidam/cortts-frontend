import { Theme } from "@react-navigation/native";

export const Fonts: Theme['fonts'] & {semiBold: Theme['fonts']['bold']} = {
  regular: {fontFamily: 'Inter_400Regular', fontWeight: '400'},
  medium: {fontFamily: 'Inter_500Medium', fontWeight: '500'},
  bold: {fontFamily: 'Inter_700Bold', fontWeight: '700'},
  semiBold: {fontFamily: 'Inter_600SemiBold', fontWeight: '600'},
  heavy: {fontFamily: 'Inter_700Bold', fontWeight: '700'}
};
