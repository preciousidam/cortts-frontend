import React from 'react';
import { ViewStyle } from 'react-native';
import { Variant } from '../button';
import { Placement } from '@floating-ui/react';

export type PopupmenuTrigger = 'hover' | 'click';

export type PopupmenuComponentProps = {
  children?: React.ReactNode;
  options?: Array<PopupmenuItemProps | void>;
  anchor?: PopupmenuAnchorComponentProps;
  trigger?: PopupmenuTrigger;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  onDismiss?: () => void;
  style?: ViewStyle;
  anchorStyle?: ViewStyle;
  modalContainerStyle?: ViewStyle;
  optionsStyle?: ViewStyle;
  triggerStyle?: ViewStyle;
  anchorVariant?: Variant;
  inHeader?: boolean;
  headerOffset?: number;
  placement?: Placement
};

export type PopupmenuItemProps = {
  label: string | React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  iconPosition?: 'left' | 'right';
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'menuitem' | 'link';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
  };
};

export type PopupmenuItemComponentProps = {
  item: PopupmenuItemProps;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export type PopupmenuAnchorProps = {
  value: string;
  ref: (node: any) => void;
  onPress: () => void;
};

export type PopupmenuAnchorComponentProps = (
  props: PopupmenuAnchorProps
) => React.ReactNode;

export type PopupComponentType = React.FC<PopupmenuComponentProps>;
