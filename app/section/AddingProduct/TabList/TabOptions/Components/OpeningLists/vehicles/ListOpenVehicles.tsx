import styles from './listOpenVehicles.module.css';
import { Button } from 'antd';
import EditIcon from '@/public/editIcon.svg';
import ListModels from './ListModels';
import { ProductContext } from '@/context/AddProduct/addProduct.context';
import { useCallback, useContext } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IVehicle } from '@/interface/addingProduct/options.interface';
import { closeWindowOptions } from '../../../options.hook';

interface IProps {
  item: IVehicle;
}

export default function ListOpenVehicles({ item }: IProps) {
  const { setShouldShowComponent } = useContext(ProductContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const showEditVehicle = (value: IVehicle) => {
    router.push(
      pathname +
        '?' +
        createQueryString('vehicleEdit', `${value.vehicleProductId}`),
    );
    closeWindowOptions('showEditVehicle', setShouldShowComponent);
  };
  return (
    <div>
      <div className={styles.parameters}>
        <div>
          <span className={styles.titleParameter}>
            {item.autoType?.name}&nbsp;
            {item.autoBrand?.name && `/ ${item.autoBrand.name}`}
          </span>

          <div className={styles.valueList}>
            &nbsp;/
            {item.autoModels?.map((model, index) => (
              <ListModels
                key={index}
                model={model}
                autoBrand={item.autoBrand}
                autoType={item.autoType}
              />
            ))}
          </div>
        </div>
        <div className={styles.interactionButton}>
          <Button
            className={'button-transparent'}
            onClick={() => showEditVehicle(item)}
          >
            <EditIcon />
          </Button>
          {/* <Button
              className={'button-transparent'}
              onClick={() => setIsOpenModalDeleting(true)}
            >
              <DeleteIcon />
            </Button> */}
        </div>
      </div>
      {/* <Modal
        open={isOpenModalDeleting}
        onCancel={() => setIsOpenModalDeleting(false)}
        centered
        className={styles.modalDelete}
        title="Удалить транспортное средство?"
        footer={null}
        width={420}
      >
        <ModalDeleteVehicles itemProps={item} hideModal={setIsOpenModalDeleting} />
      </Modal> */}
    </div>
  );
}
