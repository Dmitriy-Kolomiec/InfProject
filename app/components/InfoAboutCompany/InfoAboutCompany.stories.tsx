import type { Meta, StoryObj } from '@storybook/react';
import InfoAboutCompany from './InfoAboutCompany';
import Page from '../Page/Page';

const meta: Meta<typeof InfoAboutCompany> = {
  component: InfoAboutCompany,
  argTypes: {
    className: { description: 'string', type: 'string' },
  },
};

export default meta;
type Story = StoryObj<typeof InfoAboutCompany>;

export const InfoAboutCompanyExample: Story = {
  render: () => (
    <>
      <Page>
        <InfoAboutCompany name="Small" rating={4.7} numComments={54} />
      </Page>
      <Page>
        <InfoAboutCompany
          name="Medium and qualityMark"
          qualityMark
          rating={4.9}
          numComments={100}
        />
      </Page>
      <Page>
        <InfoAboutCompany
          name="Large"
          rating={5}
          numComments={100}
          width="large"
        />
      </Page>
    </>
  ),
};
