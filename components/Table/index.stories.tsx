import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';

import Table, { ExtendedColumnMeta } from './index.web';
import { AppThemeProvider } from '@/styleguide/theme';
import { Button } from '../button';

const meta: Meta<typeof Table> = {
  title: 'Core/Table',
  component: Table,
  decorators: [
    (Story) => (
      <AppThemeProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, }}>
          <ScrollView>
            <Story />
          </ScrollView>
        </View>
      </AppThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const BasicTable: Story = {
  args: {
    columns: [
      {
        header: 'Column 1',
        accessorKey: 'col1',
      },
      {
        header: 'Column 2',
        accessorKey: 'col2',
        meta: { width: 300, align: 'center' } as ExtendedColumnMeta<any>,
      },
      {
        header: 'Column 3',
        accessorKey: 'col3',
        cell(props) {
          return <Button>{props.getValue()}</Button>
        },
      },
    ],
    data: [
      {
        col1: 'Data 1',
        col2: 'Data 2',
        col3: 'Data 3'
      },
      {
        col1: 'Data 4',
        col2: 'Data 5',
        col3: 'Data 6'
      },
      {
        col1: 'Data 5',
        col2: 'Data 4',
        col3: 'Data 9'
      },
    ],
    filter: {field: 'col1', options: [{value: "Data 1", label: "Data 1"}, {value: "Data 4", label: "Data 4"}, {value: "Data 9", label: "Data 9"}], multiple: true},
    loading: false
  },
};

export const EmptyTable: Story = {
  args: {
    columns: [
      {
        header: 'Column 1',
        accessorKey: 'col1',
      },
      {
        header: 'Column 2',
        accessorKey: 'col2',
        meta: { width: 300, align: 'center' } as ExtendedColumnMeta<any>,
      },
      {
        header: 'Column 3',
        accessorKey: 'col3',
        cell(props) {
          return <Button>{props.getValue()}</Button>
        },
      },
    ],
    data: []
  }
}