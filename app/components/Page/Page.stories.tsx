import type { Meta, StoryObj } from '@storybook/react';

import Page from './Page';

const meta: Meta<typeof Page> = {
  component: Page,
  argTypes: {
    className: { description: 'string', type: 'string' },
    children: { description: 'ReactNode', type: 'function' },
  },
};

export default meta;
type Story = StoryObj<typeof Page>;

export const PageExample: Story = {
  argTypes: {
    style: {
      description: 'Сontent is given the required internal padding',
      type: 'string',
    },
  },
  render: () => <Page>Любой контент</Page>,
};
