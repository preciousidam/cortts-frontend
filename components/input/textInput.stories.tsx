import type { Meta, StoryObj } from '@storybook/react-native';
import { BaseTextInput, PasswordBaseInput } from './textInput';
import { View } from 'react-native';
import { AppThemeProvider } from '@/styleguide/theme';

export default {
  title: 'Core/BaseTextInput',
  component: BaseTextInput,
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
} as Meta<typeof BaseTextInput>;

type Story = StoryObj<typeof BaseTextInput>;

export const Default: Story = {
  args: {
    label: 'Example Input',
    inputProps: {
      placeholder: 'Enter text here',
    },
    info: 'This is some additional information.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Error Input',
    inputProps: {
      placeholder: 'This input has an error',
    },
    error: 'This field is required.',
  },
};

export const WithLeftIcons: Story = {
  args: {
    label: 'Input with Icons',
    inputProps: {
      placeholder: 'Enter text with icons',
      style: {width: '100%'}
    },
    leftIcon: "Ionicons.chevron-down",
    style: { width: '100%' },
  },
};

export const WithRightIcons: Story = {
  args: {
    label: 'Input with Right Icon',
    inputProps: {
      placeholder: 'Enter text with right icon',
      style: {width: '100%'}
    },
    rightIcon: "Ionicons.chevron-down",
    style: { width: '100%' },
  },
};

export const WithLeftAndRightIcons: Story = {
  args: {
    label: 'Input with Both Icons',
    inputProps: {
      placeholder: 'Enter text with both icons',
      style: {width: '100%'}
    },
    leftIcon: "Ionicons.chevron-down",
    rightIcon: "Ionicons.chevron-down",
    style: { width: '100%' },
  },
};

export const WithCustomStyle: Story = {
  args: {
    label: 'Styled Input',
    inputProps: {
      placeholder: 'This input has custom styles',
      style: { backgroundColor: '#f0f0f0', color: '#333' },
      placeholderTextColor: '#888',
    },
    style: { width: '100%' },
  },
};

export const PasswordInput: Story = {
  args: {
    label: 'Password Input',
    inputProps: {
      placeholder: 'Enter your password',
      secureTextEntry: true, 
      style: { width: '100%' },
      placeholderTextColor: '#888',
    },
    rightIcon: 'Ionicons.eye-off',
    style: { width: '100%' },
  },
  render: (args) => {
    return <PasswordBaseInput {...args} />;
  },
};

export const NGNCurrencyInput: Story = {
  args: {
    label: 'NGN Currency Input',
    inputProps: {
      placeholder: 'Enter amount',
      keyboardType: 'numeric',
      style: { width: '100%' },
      placeholderTextColor: '#888',
    },
    leftIcon: 'NGN',
    style: { width: '100%' },
  },
};