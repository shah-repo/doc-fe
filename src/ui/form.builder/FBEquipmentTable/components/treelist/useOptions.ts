import { useObserver } from 'mobx-react';
import { useEffect, useMemo } from 'react';
import { translate } from '../../../../../common/intl';
import FBAutocompleteAsyncState from '../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../helpers';
import { EquipOption } from './column.templates/types';

export const useOptions = () => {
  const equipAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId: FBAutocompleteAsyncOption.equipment,
  });

  useEffect(() => {
    equipAsync.load();
  }, [equipAsync]);

  const equipDocs = useObserver(
    () => {
      const asyncData = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.equipment) as Map<string, EquipOption>;
      return asyncData ? Array.from(asyncData.values()) : [];
    },
  );

  const equipmentOptions = useMemo(() => {
    return equipDocs?.map((material) => {
      const calibrationKey = Object.keys(material.formInput || {}).find((key) =>
        key.startsWith('section-ii-calibration'),
      );

      const calibrationData = calibrationKey
        ? material.formInput?.[calibrationKey]
        : {};

      const complianceDueDate = calibrationData?.complianceDueDate;
      const status = calibrationData?.status;

      return {
        label: translate('wo.displayRevision', {
          docId: material.document.docId,
          displayRevision: material?.displayRevision,
          name: material?.name,
        }),
        complianceDueDate,
        status,
        value: material.id,
      };
    });
  }, [equipDocs]);

  return {
    equipmentOptions,
  };
};
