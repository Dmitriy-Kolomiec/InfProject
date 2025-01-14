import AddingPositions from './AddingPositions/AddingPositions';
import OrderFormation from './OrderFormation/OrderFormation';
import PlacingOrder from './PlacingOrder/PlacingOrder';
import React from 'react';
import RecipientInfo from './RecipientInfo/RecipientInfo';
import { FormInstance } from 'antd';

interface ITabs {
  activeTab: string | null;
  setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoader?: React.Dispatch<React.SetStateAction<boolean>>;
  formRecipientInfo: FormInstance<any>;
}

export default function AddRequestPageContentTabs({
  activeTab,
  setIsDisabled,
  setIsLoader,
  formRecipientInfo,
}: ITabs): React.ReactElement {
  if (activeTab === 'addition') {
    return <AddingPositions />;
  }

  if (activeTab === 'formation') {
    return <OrderFormation />;
  }
  if (activeTab === 'placing') {
    return <PlacingOrder />;
  }
  return (
    <RecipientInfo
      setIsDisabled={setIsDisabled}
      setIsLoader={setIsLoader}
      formRecipientInfo={formRecipientInfo}
    />
  );
}
