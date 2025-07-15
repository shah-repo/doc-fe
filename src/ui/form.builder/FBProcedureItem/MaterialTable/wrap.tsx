import { differenceBy, unionBy } from 'lodash';
import { FB } from '../../helpers';
import { Material, MaterialTableProps } from './types';

export const withMaterialTableWrap = <T extends MaterialTableProps>(Component: React.FC<T>): React.FC<T> => {
  const Comp = ({ disabled, setMaterials, materials, ...props }: T) => {
    const { workspaceState } = FB.useStores();

    const updateState = (state: Material[]) => {
      setMaterials(state);
    };

    const deleteMaterial = (item: Material) => {
      const filteredMaterial = differenceBy(materials, [item], 'id');
      updateState(filteredMaterial);
    };

    const updateMaterial = (item: Material) => {
      const updatedVendors = unionBy(
        [
          {
            ...item,
          },
        ],
        materials,
        'id',
      );
      updateState(updatedVendors);
    };

    return Component({
      ...(props as T),
      disabled: disabled ?? workspaceState?.isPreview,
      materials,
      updateMaterial,
      deleteMaterial,
    });
  };

  return (props: T) => Comp(props);
};
