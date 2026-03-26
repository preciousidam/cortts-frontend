import { View } from "react-native";
import { Typography } from "./typography";
import { Button } from "./button";
import { useResponsive } from "@/hooks/useResponsive";
import PopupMenuV1 from "./PopupMenu";

type ListHeaderProps = {
  title: string;
  description: string;
  className?: string;
  secondaryAction?: {title: string; onPress: () => void};
  primaryAction?: {title: string; onPress: () => void};
};

export const ListHeader: React.FC<ListHeaderProps> = ({ title, description, className, secondaryAction, primaryAction }) => {
  const { isMobile, widthPixel, fontPixel } = useResponsive();

  return (
    <View className={`flex-row justify-between w-full${className ? ` ${className}` : ''}`}>
      <View className="flex-1">
        <Typography size='headlineSm' variant='serifBold' style={{ fontSize: fontPixel(24) }}>{title}</Typography>
        {description && (
          <Typography
            size='bodyMd'
            variant='regular'
            className="text-text-weak dark:text-dark-textWeak"
            style={{ fontSize: fontPixel(14) }}
          >
            {description}
          </Typography>
        )}
      </View>
      {!isMobile && <View className="flex-row items-center" style={{ gap: widthPixel(14) }}>
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
        <View className="flex-row items-center" style={{ gap: widthPixel(14) }}>
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
