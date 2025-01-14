import type { Meta, StoryObj } from '@storybook/react';

import { Title } from './Title';
import React from 'react';

const meta: Meta<typeof Title> = {
  component: Title,
  argTypes: {
    className: { description: 'string', type: 'string' },
    children: { description: 'ReactNode', type: 'function' },
  },
};

export default meta;
type Story = StoryObj<typeof Title>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const TitleExample: Story = {
  render: () => (
    <>
      <Title tag="h1">Заголовок 1</Title>
      <Title tag="h2">Заголовок 2</Title>
      <Title tag="h3">Заголовок 3</Title>
    </>
  ),
};

// export const SecondLevel: Story = {
//   argTypes: {
//     style: {
//       // description: 'font-size: 24px; font-weight: 600; line-height: 1.2;',
//       type: 'string',
//     },
//   },
//   render: () => <Title tag="h2">Заголовок 2</Title>,
// };

// export const ThirlLevel: Story = {
//   argTypes: {
//     style: {
//       // description: 'font-size: 18px; font-weight: 600; line-height: 1.2;',
//       type: 'string',
//     },
//   },
//   render: () => <Title tag="h3">Заголовок 3</Title>,
// };
