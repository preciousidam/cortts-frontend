import type { Meta, StoryObj } from '@storybook/react-native';
import { Typography } from './';
import { ScrollView, View } from 'react-native';
import { AppThemeProvider } from '@/styleguide/theme';

export default {
  title: 'Core/Typography',
  component: Typography,
  decorators: [
    (Story) => (
      <AppThemeProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 16 }}>
          <Story />
        </View>
      </AppThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Typography>;

type Story = StoryObj<typeof Typography>;

const sizes = ['h1', 'h2', 'body', 'caption'] as const;
const variants = ['regular', 'medium', 'semiBold', 'bold'] as const;

export const AllTypographyVariants: Story = {
  render: () => (
    <ScrollView>
      <View style={{ gap: 12 }}>
        {sizes.map((size) =>
          variants.map((variant) => (
            <Typography key={`${size}-${variant}`} size={size} variant={variant}>
              {`${variant} ${size}`}
            </Typography>
          )),
        )}
      </View>
    </ScrollView>
  ),
};
