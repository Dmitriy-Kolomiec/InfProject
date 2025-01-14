import { Title } from '@/app/components/Title/Title';
import styles from './partnumbers.module.css';
import { Button, Drawer, Switch } from 'antd';
import classNames from 'classnames';
import PlusIcon from '@/public/plus.svg';
import CloseIcon from '@/public/close.svg';
import { useEffect } from 'react';
import { TablePartnumbers } from './Components/TablePartnumbers/TablePartnumbers';
import AddCharacteristics from '../TabOptions/Components/AddCharacteristics/AddCharacteristics';
import { TreePartnumbers } from './Components/TreePartnumbers/TreePartNumbers';
import { TableNotPartnumbers } from './Components/TableNotPartNumbers/TableNotPartnumbers';
import { TableNotExist } from './Components/TableNotExist/TableNotExists';
import { usePartNumbers } from './usePartNumbers.hook';

interface IProps {
  showDrawerAddPartnumber: () => void;
}

export default function Partnumbers({ showDrawerAddPartnumber }: IProps) {
  const {
    expandedKeysTree,
    setExpandedKeysTree,
    openDrawer,
    countNotPartNumber,
    setCountNotPartNumber,
    fullnessRate,
    dataNotPartNumber,
    setDataNotPartNumber,
    treeData,
    setTreeData,
    displayLayout,
    displayNotExist,
    displayNotPartNumbers,
    dataProduct,
    filterNotPartNumbers,
    filterByPartNumbers,
    fetchFulnesRate,
    fetchNotPartNumber,
    dataProductUpdate,
    showDrawerAddCharacteristic,
    onCloseDrawer,
    expandAll,
    collapseAll,
    onChangeSwitch,
    page,
    isLoaderNotPartNumber,
  } = usePartNumbers();

  useEffect(() => {
    if (dataNotPartNumber?.amount) {
      setCountNotPartNumber(dataNotPartNumber?.amount);
    }
    fetchFulnesRate();
  }, [dataNotPartNumber]);

  // Not partNumber
  useEffect(() => {
    fetchNotPartNumber();
  }, [displayNotPartNumbers, page]);

  return (
    <div>
      <Title tag="h3">Заполненность • {fullnessRate}%</Title>
      <div className={styles.buttonWrapper}>
        <div className={styles.flexContainer}>
          <div className={styles.tabButtons}>
            <Button
              className={classNames([
                styles.tabButton,
                {
                  [styles.active]:
                    displayNotPartNumbers === 'false' ||
                    displayNotPartNumbers === null,
                },
              ])}
              onClick={filterByPartNumbers}
            >
              С номером • {dataProduct.partNumbers?.length}
            </Button>
            <Button
              className={classNames([
                styles.tabButton,
                {
                  [styles.active]: displayNotPartNumbers === 'true',
                },
              ])}
              onClick={filterNotPartNumbers}
              disabled={displayLayout === 'tree' || countNotPartNumber === 0}
            >
              Без номера • {countNotPartNumber}
            </Button>
          </div>
          {displayNotPartNumbers === 'true' && (
            <label htmlFor="switch" className={classNames([styles.switch])}>
              <Switch
                id="switch"
                onChange={onChangeSwitch}
                defaultChecked={displayNotExist === 'true'}
              />
              <span>Несуществующие детали</span>
            </label>
          )}
        </div>
        <div className={styles.addButtons}>
          {displayLayout === 'tree' && (
            <>
              {expandedKeysTree.length === 0 ? (
                <Button className="button-transparent" onClick={expandAll}>
                  Развернуть все ветки
                </Button>
              ) : (
                <Button className="button-transparent" onClick={collapseAll}>
                  Свернуть все ветки
                </Button>
              )}
            </>
          )}
          <Button
            className={classNames(['button-white', styles.addButton])}
            onClick={showDrawerAddPartnumber}
            disabled={displayLayout === 'tree'}
          >
            <PlusIcon />
            Добавить каталожный номер
          </Button>
          <Button
            className={classNames(['button-white', styles.addButton])}
            onClick={showDrawerAddCharacteristic}
          >
            <PlusIcon />
            Добавить характеристику
          </Button>
        </div>
      </div>
      {displayLayout === 'tree' ? (
        <TreePartnumbers
          treeData={treeData}
          setTreeData={setTreeData}
          expandedKeys={expandedKeysTree}
          setExpandedKeys={setExpandedKeysTree}
        />
      ) : (
        <>
          {displayNotPartNumbers === 'false' ||
          displayNotPartNumbers === null ? (
            <TablePartnumbers
              dataProductUpdate={dataProductUpdate}
              addCharacteristic={showDrawerAddCharacteristic}
            />
          ) : (
            <>
              {displayNotExist === 'false' || displayNotExist === null ? (
                <TableNotPartnumbers
                  dataNotPartNumber={dataNotPartNumber}
                  setDataNotPartNumber={setDataNotPartNumber}
                  page={page}
                  isLoaderNotPartNumber={isLoaderNotPartNumber}
                />
              ) : (
                <TableNotExist setDataNotPartNumber={setDataNotPartNumber} />
              )}
            </>
          )}
        </>
      )}

      <Drawer
        styles={{
          body: {
            padding: 0,
          },
        }}
        onClose={onCloseDrawer}
        open={openDrawer}
        width={480}
        closeIcon={false}
        extra={
          <Button className="button-transparent" onClick={onCloseDrawer}>
            <CloseIcon />
          </Button>
        }
      >
        <AddCharacteristics closeDrawer={onCloseDrawer} />
      </Drawer>
    </div>
  );
}
