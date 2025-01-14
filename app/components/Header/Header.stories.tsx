import type { Meta, StoryObj } from '@storybook/react';

import Header from './Header';

const meta: Meta<typeof Header> = {
  component: Header,
  //   argTypes: {
  //     className: { description: 'string', type: 'string' },
  //     children: { description: 'ReactNode', type: 'function' },
  //   },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const HeaderExample: Story = {
  render: () => <Header />,
};
