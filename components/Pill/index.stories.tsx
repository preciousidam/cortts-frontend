import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { ColoredPill } from '.';
import { AppThemeProvider } from '@/styleguide/theme';

const meta: Meta = {
  title: 'Core/ColoredPill',
  component: ColoredPill,
  decorators: [(Story) => (
    <AppThemeProvider>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Story />
      </View>
    </AppThemeProvider>
  )],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ColoredPillStory: Story = {
  args: {
    success: {
      title: "Success",
      color: 'green'
    },
    error: {
      title: "Error",
      color: 'red'
    },
    info: {
      title: "Info",
      color: 'blue'
    },
    warning: {
      title: "Warning",
      color: 'yellow'
    },
    default: {
      title: "Default",
      color: 'gray'
    },
  },
  render: (props) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      <ColoredPill {...props.success} />
      <ColoredPill {...props.error} />
      <ColoredPill {...props.info} />
      <ColoredPill {...props.warning} />
      <ColoredPill {...props.default} />
    </View>
  )
};

