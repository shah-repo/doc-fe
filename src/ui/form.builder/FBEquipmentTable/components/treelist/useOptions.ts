import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { translate } from '../../../../../common/intl';
import FBAutocompleteAsyncState from '../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../helpers';
import { customEQOptionType, EquipOption } from './column.templates/types';

const parseEquipmentOption = (equipment: EquipOption): customEQOptionType => {
  const calibrationKey = Object.keys(equipment.formInput || {}).find((key) => key.startsWith('section-ii-calibration'));
  const preventiveMaintenanceKey = Object.keys(equipment.formInput || {}).find((key) => key.startsWith('section-iii-preventative-maintenance'));
  const calibrationData = calibrationKey ? equipment.formInput?.[calibrationKey] : {};
  const preventiveMaintenanceData = preventiveMaintenanceKey ? equipment?.formInput?.[preventiveMaintenanceKey] : {};
  return {
    label: translate('common.select.revision', {
      docId: equipment.document.docId,
      displayRevision: equipment?.displayRevision,
      name: equipment?.name,
    }),
    complianceDueDate: calibrationData?.complianceDueDate ?? preventiveMaintenanceData.complianceDueDate,
    calDueDate: calibrationData.complianceDueDate,
    pmDueDate: preventiveMaintenanceData.complianceDueDate,
    status: calibrationData?.status,
    value: equipment.id,
  };
};

export const useOptions = () => {
  const optionId = FBAutocompleteAsyncOption.equipment;
  const equipAsync = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, {
    optionId,
  });

  useEffect(() => {
    equipAsync.load();
  }, [equipAsync]);

  return useObserver(() => {
    const asyncData = FBAutocompleteAsyncStore.data.get(optionId) as Map<
    string,
    EquipOption
    >;

    const equipmentOptions = Array.from(asyncData?.values() || []).map(parseEquipmentOption);

    return {
      equipmentOptions,
    };
  });
};
