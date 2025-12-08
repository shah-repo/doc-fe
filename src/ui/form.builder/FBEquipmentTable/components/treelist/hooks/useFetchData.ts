import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { translate } from '../../../../../../common/intl';
import FBAutocompleteAsyncState from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../../helpers';
import { customEQOptionType, EquipOption } from '../column.templates/types';

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

export const useFetchData = () => {
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

export const useEquipmentOptions = (id: string, isEquipmentSpecification: boolean) => {
  const optionId = isEquipmentSpecification ? FBAutocompleteAsyncOption.equipmentSpecifications : FBAutocompleteAsyncOption.equipment;
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { optionId });

  useEffect(() => {
    if (id && optionId) {
      autocompleteAsyncState.setOptionId(optionId);
      autocompleteAsyncState.fetchAutocompleteOption(id, optionId);
    }
  }, [autocompleteAsyncState, id, optionId]);

  return useObserver(() => {
    if (!optionId) {
      return { equipmentSpcOptions: [] };
    }

    // Check if data is in the API response
    const apiData = autocompleteAsyncState.autocompleteValueApi.data;
    let asyncData = FBAutocompleteAsyncStore.data.get(optionId) as Map<string, EquipOption>;
    const preparedData = Array.isArray(apiData) ? apiData : [apiData];

    // If API has returned data but store is empty, process and store it
    if (apiData && preparedData.length > 0) {
      // Validate that we have data before storing
      const dataSize = asyncData?.size ?? 0;
      const isDataEmpty = dataSize === 0;
      const hasDataMismatch = dataSize !== preparedData.length;

      if (isDataEmpty || hasDataMismatch) {
        FBAutocompleteAsyncStore.setOptionData(optionId, preparedData);
        asyncData = FBAutocompleteAsyncStore.data.get(optionId) as Map<string, EquipOption>;
      }
    }

    const equipmentSpcOptions = Array.from(asyncData?.values() ?? []).map(parseEquipmentOption);

    return {
      equipmentSpcOptions,
    };
  });
};
