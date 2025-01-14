import {
  IProductCardModal,
  IPropertyPartNumber,
  IReplacementProduct,
  ISelectedRows,
} from '@/interface/request/request.interface';
import { Modal } from 'antd';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ReplacementProductModal } from './ReplacementProduct/ReplacementProduct';
import { RequestContext } from '@/context/Request/request.context';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import {
  INotPropertiesTree,
  IProduct,
} from '@/interface/publicPart/publicPart.interface';
import { PropertiesTree } from '@/app/components/Product/product.interface';
import { Product } from '@/app/components/Product/Product';
import { SupplyRequestModal } from './SupplyRequest/SupplyRequestModal';

interface IProps {
  replacementProduct: IReplacementProduct | undefined;
  isOpenModalReplacementProduct: boolean;
  setIsOpenModalReplacementProduct: Dispatch<SetStateAction<boolean>>;
  isOpenModalProduct: boolean;
  setIsOpenModalProduct: Dispatch<SetStateAction<boolean>>;
  isOpenModalSupplyRequest: boolean;
  setIsOpenModalSupplyRequest: Dispatch<SetStateAction<boolean>>;
  selectedRows: ISelectedRows[] | undefined;
  resetSelection: () => void;
}

export const ModalsContainer = ({
  replacementProduct,
  isOpenModalReplacementProduct,
  setIsOpenModalReplacementProduct,
  isOpenModalProduct,
  setIsOpenModalProduct,
  isOpenModalSupplyRequest,
  setIsOpenModalSupplyRequest,
  selectedRows,
  resetSelection,
}: IProps) => {
  const { dataRequest } = useContext(RequestContext);
  const [dataProductModal, setDataProductModal] = useState<IProduct | null>(
    null,
  );
  const [propertiesTree, setPropertiesTree] = useState<
    PropertiesTree[] | INotPropertiesTree
  >();
  const [partNumberIds, setPartNumberIds] = useState<number[]>([]);
  const [dataOffers, setDataOffers] = useState<IProductCardModal>();
  const [loadingDataOffers, setLoadingDataOffers] = useState<boolean>(false);
  const [propertiesPartNumber, setPropertiesPartNumber] =
    useState<IPropertyPartNumber[]>();

  const fetchPropertiesProduct = async () => {
    if (replacementProduct?.productId) {
      try {
        const { data } = await APIRequest.get<IPropertyPartNumber[]>(
          API_ENDPOINTS.GET_PARTNUMBER_PROPERTIES(
            replacementProduct?.partNumberId,
          ),
        );
        setPropertiesPartNumber(data);
      } catch (error) {
        console.error('Ошибка при запросе public product:', error);
      }
    }
  };

  const fetchDataProduct = async () => {
    if (replacementProduct?.productId) {
      try {
        const { data } = await APIRequest.get<IProduct>(
          API_ENDPOINTS.GET_PUBLIC_PRODUCT(
            replacementProduct?.productId,
            replacementProduct?.partNumberId,
          ),
        );
        setDataProductModal(data);
      } catch (error) {
        console.error('Ошибка при запросе public product:', error);
      }
    }
  };

  const fetchOffers = async () => {
    setLoadingDataOffers(true);
    const jsonString = JSON.stringify({
      order: dataRequest.request?.id,
      partnumber: partNumberIds,
    });

    const payload = encodeURIComponent(jsonString);

    try {
      const { data } = await APIRequest.get(
        API_ENDPOINTS.GET_PRODUCT_CARD(payload),
      );
      setDataOffers(data);
    } catch (error) {
      console.error('Ошибка при запросе offers:', error);
    } finally {
      setLoadingDataOffers(false);
    }
  };

  const fetchTree = async () => {
    if (replacementProduct?.productId) {
      try {
        const { data } = await APIRequest.get(
          API_ENDPOINTS.GET_PUBLIC_PROPERTIES_TREE(
            replacementProduct?.productId,
          ),
        );
        setPropertiesTree(data);
      } catch (error) {
        console.error('Ошибка при запросе public propertiesTree:', error);
      }
    }
  };

  const openModalProduct = () => {
    setIsOpenModalReplacementProduct(false);
    setIsOpenModalProduct(true);
  };

  const hideModalProduct = () => {
    setPartNumberIds([]);
    setIsOpenModalReplacementProduct(false);
    setIsOpenModalProduct(false);
  };

  useEffect(() => {
    if (!!partNumberIds.length) {
      fetchOffers();
    }
  }, [dataRequest.request?.id, partNumberIds]);

  useEffect(() => {
    fetchDataProduct();
    fetchTree();
    fetchPropertiesProduct();
  }, [replacementProduct]);

  return (
    <>
      {dataProductModal && (
        <>
          <Modal
            open={isOpenModalReplacementProduct}
            onCancel={() => setIsOpenModalReplacementProduct(false)}
            centered
            title={replacementProduct?.name}
            footer={null}
            width={600}
          >
            {!!propertiesPartNumber && (
              <ReplacementProductModal
                properties={propertiesPartNumber}
                openModalProduct={openModalProduct}
              />
            )}
          </Modal>
          {propertiesTree && (
            <Modal
              open={isOpenModalProduct}
              onCancel={hideModalProduct}
              centered
              title={dataProductModal.product.name}
              footer={null}
              width="95%"
            >
              <Product
                dataProduct={dataProductModal}
                propertiesTree={propertiesTree}
                modalWindow
                dataOffers={dataOffers}
                partNumberIdModal={String(replacementProduct?.partNumberId)}
                setPartNumberIdsModal={setPartNumberIds}
                loadingDataOffers={loadingDataOffers}
              />
            </Modal>
          )}
        </>
      )}
      {!!selectedRows?.length && (
        <Modal
          open={isOpenModalSupplyRequest}
          onCancel={() => setIsOpenModalSupplyRequest(false)}
          centered
          title="Отправить запрос в снабжение?"
          footer={null}
          width={530}
        >
          <SupplyRequestModal
            selectedRows={selectedRows}
            hideModal={setIsOpenModalSupplyRequest}
            resetSelection={resetSelection}
          />
        </Modal>
      )}
    </>
  );
};
