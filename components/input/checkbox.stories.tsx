import type { Meta, StoryObj } from '@storybook/react-native';
import { BaseCheckbox } from './checkbox';
import { View } from 'react-native';
import { AppThemeProvider } from '@/styleguide/theme';

export default {
  title: 'Core/Checkbox',
  component: BaseCheckbox,
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
} as Meta<typeof BaseCheckbox>;

type Story = StoryObj<typeof BaseCheckbox>;

export const Default: Story = {
  args: {
    label: 'Example Checkbox',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked Checkbox',
    checked: true,
  },
};

