import type { Meta, StoryObj } from '@storybook/react';

import FeedbackSupplier from './FeedbackSupplier';

const meta: Meta<typeof FeedbackSupplier> = {
  component: FeedbackSupplier,
  argTypes: {
    className: { description: 'string', type: 'string' },
  },
};

export default meta;
type Story = StoryObj<typeof FeedbackSupplier>;

export const FeedbackSupplierExample: Story = {
  render: () => <FeedbackSupplier />,
};
