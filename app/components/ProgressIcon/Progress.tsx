import SuccessIcon from '@/public/success.svg';
import WarningIcon from '@/public/warning.svg';
import ErrorIcon from '@/public/error.svg';
import { Tooltip } from 'antd';
import { getPopupContainer } from '@/data/utils.common';

export default function Progress({ status }: { status: string }) {
  if (status === 'success') {
    return (
      <Tooltip
        title="Заполнены все данные"
        getPopupContainer={getPopupContainer}
      >
        <SuccessIcon />
      </Tooltip>
    );
  }

  if (status === 'warning') {
    return (
      <Tooltip
        title="Заполнены не все данные"
        getPopupContainer={getPopupContainer}
      >
        <WarningIcon />
      </Tooltip>
    );
  }

  if (status === 'error') {
    return (
      <Tooltip
        title="Несуществующая деталь"
        getPopupContainer={getPopupContainer}
      >
        <ErrorIcon />
      </Tooltip>
    );
  }

  return null;
}
