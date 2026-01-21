import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { translate } from '../../../../../../common/intl';
import { DocumentCategory, DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncState from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../../helpers';
import { customEQOptionType, EquipOption } from '../column.templates/types';

const isValidDate = (date?: string): boolean => Boolean(date && !Number.isNaN(Date.parse(date)));

const parseEquipmentOption = (equipment: EquipOption): customEQOptionType => {
  const { id, name, eqStatus, displayRevision, document, precalc, status } = equipment;
  const caliDueDate = precalc?.cali_due_date;
  const pmDueDate = precalc?.pm_due_date;
  const validCalDate = isValidDate(caliDueDate) ? caliDueDate : '';
  const validPmDate = isValidDate(pmDueDate) ? pmDueDate : '';

  return {
    label: translate('common.select.revision', {
      docId: document?.docId,
      displayRevision,
      name,
    }),
    complianceDueDate: validCalDate ?? validPmDate ?? '',
    calDueDate: validCalDate,
    pmDueDate: validPmDate,
    status: eqStatus,
    value: id,
    docStatus: status,
    category: document.documentType.category,
  };
};

const restrictedStatuses = [DocumentRevisionStatus.Canceled];
const filterByRestrictedStatus = (equipments: EquipOption[]) => {
  return equipments.filter((material) => !restrictedStatuses.includes(material.status));
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

    const equipments = Array.from(asyncData?.values() ?? []) ?? [];
    const allowedEditEqOptions = filterByRestrictedStatus(equipments)?.map(parseEquipmentOption);
    const equipmentOptions = equipments.map(parseEquipmentOption);

    const equipmentOnlyOptions = equipments.filter((option) => option.document.documentType.category === DocumentCategory.Equipment);
    const filterEquipmentOptions = equipmentOnlyOptions.map(parseEquipmentOption);

    const releasedEquipments = equipments.filter((equ) => equ.status === DocumentRevisionStatus.Released);
    const releasedEquipmentOptions = releasedEquipments.map(parseEquipmentOption);

    return {
      equipmentOptions,
      allowedEditEqOptions,
      releasedEquipmentOptions,
      filterEquipmentOptions,
    };
  });
};

export const useEquipmentOptions = (id: string) => {
  const baseOptionId = FBAutocompleteAsyncOption.equipmentSpecifications;
  // Create a unique key by combining optionId with id to avoid conflicts between different equipment specs
  const uniqueOptionId = id ? `${baseOptionId}_${id}` : baseOptionId;
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { optionId: baseOptionId });

  useEffect(() => {
    if (!id) {
      return;
    }

    // Check if data is already in store, if so, skip API call
    const existingData = FBAutocompleteAsyncStore.data.get(uniqueOptionId);
    if (existingData && existingData.size > 0) {
      return;
    }

    autocompleteAsyncState.setOptionId(baseOptionId);
    autocompleteAsyncState.fetchAutocompleteOption(id, baseOptionId);
  }, [autocompleteAsyncState, id, baseOptionId, uniqueOptionId]);

  return useObserver(() => {
    if (!id) {
      return {
        equipmentSpcOptions: [],
        allowedEditEqSpecOptions: [],
      };
    }

    // Try to get data from store with unique key first
    let asyncData = FBAutocompleteAsyncStore.data.get(uniqueOptionId) as Map<string, EquipOption>;

    // If not in store, check if API has returned data
    if (!asyncData || asyncData.size === 0) {
      const apiData = autocompleteAsyncState.autocompleteValueApi.data;

      if (apiData) {
        const preparedData = Array.isArray(apiData) ? apiData : [apiData];

        if (preparedData.length > 0) {
          // Store with unique key to avoid conflicts
          FBAutocompleteAsyncStore.setOptionData(uniqueOptionId, preparedData);
          asyncData = FBAutocompleteAsyncStore.data.get(uniqueOptionId) as Map<string, EquipOption>;
        } else {
          // If API response is empty, set empty array
          FBAutocompleteAsyncStore.setOptionData(uniqueOptionId, []);
        }
      }
    }

    const equipmentSpecs = Array.from(asyncData?.values() ?? []) ?? [];
    const equipmentSpcOptions = equipmentSpecs.map(parseEquipmentOption);
    const allowedEditEqSpecOptions = filterByRestrictedStatus(equipmentSpecs).map(parseEquipmentOption);

    return {
      equipmentSpcOptions,
      allowedEditEqSpecOptions,
    };
  });
};
