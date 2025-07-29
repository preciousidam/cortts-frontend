


import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { AppThemeProvider } from '@/styleguide/theme';
import { BaseDropdown } from './dropdown';
import { Button } from '../../button';
import { Typography } from '../../typography';
import { DropdownOption } from './dropdownStyles';

const meta: Meta<typeof BaseDropdown> = {
  title: 'Core/Dropdown',
  component: BaseDropdown,
  decorators: [
    (Story) => (
      <AppThemeProvider>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Story />
        </View>
      </AppThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BaseDropdown>;

const sampleOptions: DropdownOption[] = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'Terrace', value: 'terrace' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Bungalow', value: 'bungalow' },
  { label: 'Penthouse', value: 'penthouse' },
];

export const SingleSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <BaseDropdown
        label="Unit Type"
        placeholder="Select one"
        options={sampleOptions}
        selectedValues={value}
        onSelect={setValue}
        multiSelect={false}
      />
    );
  },
};

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <BaseDropdown
        label="Unit Types"
        placeholder="Select multiple"
        options={sampleOptions}
        selectedValues={value}
        onSelect={setValue}
        multiSelect={true}
      />
    );
  },
};

export const SelectWithAnchor: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <BaseDropdown
        label="Unit Types"
        placeholder="Select multiple"
        options={sampleOptions}
        selectedValues={value}
        onSelect={setValue}
        multiSelect={true}
        anchor={({ ref, value, onPress }) => (
          <Button ref={ref} onPress={onPress}>
            <Typography>{value}</Typography>
          </Button>
        )}
      />
    );
  },
};