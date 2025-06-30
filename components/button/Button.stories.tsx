import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Button } from './Button';
import { AppThemeProvider } from '@/styleguide/theme';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  decorators: [
    (Story) => (
      <AppThemeProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Story />
        </View>
      </AppThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
    size: 'medium',
  },
};

export const PrimarySmall: Story = {
  args: { ...Primary.args, size: 'small' },
};
export const PrimaryMedium: Story = {
  args: { ...Primary.args, size: 'medium' },
};
export const PrimaryLarge: Story = {
  args: { ...Primary.args, size: 'large' },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
    size: 'medium',
  },
};
export const SecondarySmall: Story = {
  args: { ...Secondary.args, size: 'small' },
};
export const SecondaryMedium: Story = {
  args: { ...Secondary.args, size: 'medium' },
};
export const SecondaryLarge: Story = {
  args: { ...Secondary.args, size: 'large' },
};

export const Outlined: Story = {
  args: {
    children: 'Outlined',
    variant: 'outlined',
    size: 'medium',
  },
};
export const OutlinedSmall: Story = {
  args: { ...Outlined.args, size: 'small' },
};
export const OutlinedMedium: Story = {
  args: { ...Outlined.args, size: 'medium' },
};
export const OutlinedLarge: Story = {
  args: { ...Outlined.args, size: 'large' },
};

export const Tertiary: Story = {
  args: {
    children: 'Tertiary',
    variant: 'tertiary',
    size: 'medium',
  },
};
export const TertiarySmall: Story = {
  args: { ...Tertiary.args, size: 'small' },
};
export const TertiaryMedium: Story = {
  args: { ...Tertiary.args, size: 'medium' },
};
export const TertiaryLarge: Story = {
  args: { ...Tertiary.args, size: 'large' },
};

export const Loading: Story = {
  args: {
    children: 'Loading',
    variant: 'primary',
    isLoading: true,
    size: 'medium',
  },
};
export const LoadingSmall: Story = {
  args: { ...Loading.args, size: 'small' },
};
export const LoadingMedium: Story = {
  args: { ...Loading.args, size: 'medium' },
};
export const LoadingLarge: Story = {
  args: { ...Loading.args, size: 'large' },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    disabled: true,
    size: 'medium',
  },
};
export const DisabledSmall: Story = {
  args: { ...Disabled.args, size: 'small' },
};
export const DisabledMedium: Story = {
  args: { ...Disabled.args, size: 'medium' },
};
export const DisabledLarge: Story = {
  args: { ...Disabled.args, size: 'large' },
};

export const IconLeft: Story = {
  args: {
    children: 'With Icon',
    variant: 'primary',
    icon: "Ionicons.camera",
    size: 'medium',
  },
};
export const IconLeftSmall: Story = {
  args: { ...IconLeft.args, size: 'small' },
};
export const IconLeftMedium: Story = {
  args: { ...IconLeft.args, size: 'medium' },
};
export const IconLeftLarge: Story = {
  args: { ...IconLeft.args, size: 'large' },
};

export const IconRight: Story = {
  args: {
    children: 'Next',
    variant: 'primary',
    rightIcon: "Ionicons.chevron-forward",
    size: 'medium',
  },
};
export const IconRightSmall: Story = {
  args: { ...IconRight.args, size: 'small' },
};
export const IconRightMedium: Story = {
  args: { ...IconRight.args, size: 'medium' },
};
export const IconRightLarge: Story = {
  args: { ...IconRight.args, size: 'large' },
};

export const IconOnly: Story = {
  args: {
    icon: "Ionicons.heart",
    variant: 'primary',
    iconOnly: true,
    size: 'medium',
  },
};
export const IconOnlySmall: Story = {
  args: { ...IconOnly.args, size: 'small' },
};
export const IconOnlyMedium: Story = {
  args: { ...IconOnly.args, size: 'medium' },
};
export const IconOnlyLarge: Story = {
  args: { ...IconOnly.args, size: 'large' },
};