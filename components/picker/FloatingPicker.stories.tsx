import React from 'react';
import { View, Button } from 'react-native';
import type { StoryObj, Meta } from '@storybook/react-native';
import { FloatingPicker } from './FloatingPicker';

const sampleItems = [
  { code: 'NG', dialCode: '+234', name: 'Nigeria' },
  { code: 'US', dialCode: '+1', name: 'United States' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom' },
];

export default {
  title: 'Core/Picker',
  component: FloatingPicker,
} as Meta<typeof FloatingPicker>;

type Story = StoryObj<typeof FloatingPicker>;

export const Default: Story = {
  args: {
    items: sampleItems,
    visible: true,
    onClose: () => {},
  },
  render: ({items, ...rest}) => {
    const [visible, setVisible] = React.useState(true);

    return (
      <View style={{ flex: 1 }}>
        <Button title="Open Picker" onPress={() => setVisible(true)} />
        <FloatingPicker<{ code: string; dialCode: string; name: string }>
          items={sampleItems}
          {...rest}
          visible={visible}
          onClose={() => setVisible(false)}
          keyExtractor={(item: { code: string }) => item.code}
          labelExtractor={(item: { name: string; dialCode: string }) => `${item.name} (${item.dialCode})`}
          onSelect={(item: { name: string }) => alert(`Selected: ${item.name}`)}
          title="Select a Country"
          searchable
        />
      </View>
    );
  },
};
