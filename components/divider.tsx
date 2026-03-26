import { View } from "react-native";

export const Divider = ({ className }: { className?: string }) => {
  return (
    <View
      className={`h-3 w-full rounded-full bg-surfaceContainerLow dark:bg-dark-card${className ? ` ${className}` : ''}`}
    />
  );
};
