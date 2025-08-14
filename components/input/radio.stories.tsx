import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { AppThemeProvider } from '@/styleguide/theme';
import { BaseRadioButton } from './radio';

export default {
  title: 'Core/RadioButton',
  component: BaseRadioButton,
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
} as Meta<typeof BaseRadioButton>;

type Story = StoryObj<typeof BaseRadioButton>;

export const Default: Story = {
  args: {
    label: 'Example Radio Button',
    selected: 'option1',
    onSelect: (value) => console.log('Selected:', value),
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    layout: 'horizontal',
  },
};
export const VerticalLayout: Story = {
  args: {
    label: 'Example Radio Button',
    selected: 'option1',
    onSelect: (value) => console.log('Selected:', value),
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    layout: 'vertical',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Radio Button',
    selected: 'option1',
    onSelect: (value) => console.log('Selected:', value),
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    disabled: true,
  },
};

export const WithCustomStyle: Story = {
  args: {
    label: 'Custom Styled Radio Button',
    selected: 'option1',
    onSelect: (value) => console.log('Selected:', value),
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    style: { backgroundColor: '#f0f0f0', padding: 10 },
    labelStyle: { color: '#333' },
  },
};

export const RequiredField: Story = {
  args: {
    label: 'Required Radio Button',
    selected: 'option1',
    onSelect: (value) => console.log('Selected:', value),
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    required: true,
  },
};

