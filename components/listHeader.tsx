import { StyleSheet, View } from "react-native";
import { Typography } from "./typography";
import { Button } from "./button";
import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import PopupMenuV1 from "./PopupMenu";

type ListHeaderProps = {
  title: string;
  description: string;
  secondaryAction?: {title: string; onPress: () => void};
  primaryAction?: {title: string; onPress: () => void};
};

export const ListHeader: React.FC<ListHeaderProps> = ({ title, description, secondaryAction, primaryAction }) => {
  const styles = useStyles();
  const { isMobile } = useResponsive();

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Typography size='subtitle' variant='semiBold' style={styles.title}>{title}</Typography>
        {description && <Typography size='body' variant='regular' style={styles.description}>{description}</Typography>}
      </View>
      {!isMobile && <View style={styles.cta}>
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
      </View>}
      {isMobile && (
        <View style={styles.cta}>
          <PopupMenuV1 anchor={props => <Button variant="secondary" {...props} icon="Ionicons.ellipsis-vertical" iconOnly />} options={[
            primaryAction && {
              label: primaryAction.title,
              onPress: primaryAction.onPress
            },
            secondaryAction && {
              label: secondaryAction.title,
              onPress: secondaryAction.onPress
            }
          ]} />
        </View>
      )}
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
      color: colors.text.weak
    },
    cta: {
      flexDirection: 'row',
      gap: widthPixel(14),
      alignItems: 'center',
    },
  });
};