import { Theme } from "@react-navigation/native";

export const Fonts: Theme['fonts'] & {semiBold: Theme['fonts']['bold']} = {
  regular: {fontFamily: 'Manrope_400Regular', fontWeight: '400'},
  medium: {fontFamily: 'Manrope_500Medium', fontWeight: '500'},
  bold: {fontFamily: 'Manrope_700Bold', fontWeight: '700'},
  semiBold: {fontFamily: 'Manrope_600SemiBold', fontWeight: '600'},
  heavy: {fontFamily: 'Manrope_700Bold', fontWeight: '700'}
};

export const SerifFonts = {
  regular: {fontFamily: 'NotoSerifJP_400Regular', fontWeight: '400' as const},
  medium:  {fontFamily: 'NotoSerifJP_500Medium',  fontWeight: '500' as const},
  bold:    {fontFamily: 'NotoSerifJP_700Bold',     fontWeight: '700' as const},
};
