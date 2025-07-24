import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { toastConfig } from '.';
import Toast, { BaseToast } from 'react-native-toast-message';
import { AppThemeProvider } from '@/styleguide/theme';
import { Button } from '../button';

const meta: Meta = {
  title: 'Core/Toast',
  component: BaseToast,
  decorators: [(Story) => (
    <AppThemeProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Story />
        <Toast config={toastConfig()} />
      </View>
    </AppThemeProvider>
  )],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    success: {
      type: 'success',
      text1: 'Success',
      text2: 'This is a success message',
    },
    error: {
      type: 'error',
      text1: 'Error',
      text2: 'This is an error message',
    },
    info: {
      type: 'info',
      text1: 'Info',
      text2: 'This is an info message',
    },
    warning: {
      type: 'warning',
      text1: 'Warning',
      text2: 'This is a warning message',
    },
    default: {
      type: 'default',
      text1: 'Default',
      text2: 'This is a default message',
    }
  },
  render: (props) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <Button title="Show Success" onPress={() => Toast.show(props.success)} />
      <Button title="Show Error" onPress={() => Toast.show(props.error)} />
      <Button title="Show Info" onPress={() => Toast.show(props.info)} />
      <Button title="Show Warning" onPress={() => Toast.show(props.warning)} />
      <Button title="Show Default" onPress={() => Toast.show(props.default)} />
    </View>
  ),
};

