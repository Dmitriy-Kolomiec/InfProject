import type { Meta, StoryObj } from '@storybook/react';

import PageContent from './PageContent';

const meta: Meta<typeof PageContent> = {
  component: PageContent,
  argTypes: {
    className: { description: 'string', type: 'string' },
    children: { description: 'ReactNode', type: 'function' },
  },
};

export default meta;
type Story = StoryObj<typeof PageContent>;

export const PageContentExample: Story = {
  render: () => <PageContent>Любой контент</PageContent>,
};
