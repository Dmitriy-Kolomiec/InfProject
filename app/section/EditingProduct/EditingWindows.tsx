import React from 'react';
import styles from './editProduct.module.css';
import AddCategory from '../AddingProduct/TabList/TabOptions/Components/Category/AddCategory/AddCategory';
import EditCategory from '../AddingProduct/TabList/TabOptions/Components/Category/EditCategory/EditCategory';
import AddCharacteristics from '../AddingProduct/TabList/TabOptions/Components/AddCharacteristics/AddCharacteristics';
import AddVehicles from '../AddingProduct/TabList/TabOptions/Components/Vehicles/addVehicles/AddVehicles';
import AddRelations from '../AddingProduct/TabList/Сonnections/Components/AddConnection/AddRelations';
import EditCharacteristics from '../AddingProduct/TabList/TabOptions/Components/AddCharacteristics/EditCharacteristic';
import EditVehicles from '../AddingProduct/TabList/TabOptions/Components/Vehicles/editVehicles/EditVehicles';
import { IShouldShow } from '@/interface/addingProduct/product.interface';
import EditRelations from '../AddingProduct/TabList/Сonnections/Components/EditConnection/EditRelations';

interface IProps {
  shouldShowComponent: IShouldShow;
}

export const EditingWindows: React.FC<IProps> = ({ shouldShowComponent }) => {
  return (
    <div className={styles.addBlock}>
      {shouldShowComponent.showAddingCategory && <AddCategory />}
      {shouldShowComponent.showEditCategory && <EditCategory />}
      {shouldShowComponent.showAddingProperties && <AddCharacteristics />}
      {shouldShowComponent.showEditProperties && <EditCharacteristics />}
      {shouldShowComponent.showAddingVehicle && <AddVehicles />}
      {shouldShowComponent.showEditVehicle && <EditVehicles />}
      {shouldShowComponent.showAddingRelations && <AddRelations />}
      {shouldShowComponent.showEditRelations && <EditRelations />}
    </div>
  );
};
