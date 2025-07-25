import { StyleSheet, View } from "react-native";
import { Typography } from "./typography";
import { Button } from "./button";
import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/styleguide/theme/ThemeContext";

type ListHeaderProps = {
  title: string;
  description: string;
  secondaryAction?: {title: string; onPress: () => void};
  primaryAction?: {title: string; onPress: () => void};
};

export const ListHeader: React.FC<ListHeaderProps> = ({ title, description, secondaryAction, primaryAction }) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View>
        <Typography size='subtitle' variant='semiBold' style={styles.title}>{title}</Typography>
        {description && <Typography size='body' variant='regular' style={styles.description}>{description}</Typography>}
      </View>
      <View style={styles.cta}>
        {secondaryAction && (
          <Button variant='secondary' size="large" onPress={secondaryAction.onPress}>
            {secondaryAction.title}
          </Button>
        )}
        {primaryAction && (
          <Button variant='primary' size="large" onPress={primaryAction.onPress} rightIcon="Ionicons.add">
            {primaryAction.title}
          </Button>
        )}
      </View>
    </View>
  );
};

const useStyles = () => {
  const {isMobile, widthPixel, heightPixel, fontPixel} = useResponsive();
  const {colors} = useTheme();
  return StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    title: {
      fontSize: fontPixel(24),
    },
    description: {
      fontSize: fontPixel(14),
      color: colors.textWeak
    },
    cta: {
      flexDirection: 'row',
      gap: widthPixel(14),
      alignItems: 'center',
    },
  });
};