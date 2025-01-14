import styles from './interactiveButtons.module.css';
import ArrowDownIcon from '@/public/arrow-down.svg';
import GoToCategoryIcon from '@/public/goToCategory.svg';
import PlusIcon from '@/public/plus.svg';
import EditIcon from '@/public/editIcon.svg';
import DeleteIcon from '@/public/deleteBgWhite.svg';
import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import { ButtonsProps } from './interactiveButtons.props';
import { getPopupContainer } from '@/data/utils.common';
import {
  DownOutlined,
  RightCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

export const InteractiveButtons = ({
  deleteModal,
  addSubCategory,
  openCategory,
  editCategory,
  toCategory,
  idCategory,
  isOpen,
  className,
}: ButtonsProps) => {
  return (
    <div className={classNames([styles.container, className])}>
      <Tooltip
        title="Развернуть все вложенные категории"
        getPopupContainer={getPopupContainer}
      >
        <Button
          className={classNames([
            'button-transparent',
            styles.button,
            styles.arrowIcon,
            styles.iconOpenCategory,
            {
              [styles.open]: isOpen,
            },
          ])}
          onClick={openCategory}
        >
          <DownOutlined />
        </Button>
      </Tooltip>
      <Tooltip
        title="Перейти в категорию"
        getPopupContainer={getPopupContainer}
      >
        <Button
          className={classNames(['button-transparent', styles.button])}
          onClick={() => toCategory(idCategory)}
        >
          <RightCircleOutlined />
        </Button>
      </Tooltip>
      <Tooltip
        title="Добавить подкатегорию"
        getPopupContainer={getPopupContainer}
      >
        <Button
          className={classNames(['button-transparent', styles.button])}
          onClick={addSubCategory}
        >
          <PlusOutlined />
        </Button>
      </Tooltip>

      <Tooltip title="Редактировать" getPopupContainer={getPopupContainer}>
        <Button
          className={classNames(['button-transparent', styles.button])}
          onClick={editCategory}
        >
          <EditOutlined />
        </Button>
      </Tooltip>
      <Tooltip title="Удалить" getPopupContainer={getPopupContainer}>
        <Button
          className={classNames(['button-transparent', styles.button])}
          onClick={() => deleteModal(true)}
        >
          <DeleteOutlined />
        </Button>
      </Tooltip>
    </div>
  );
};
