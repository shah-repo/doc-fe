import { useObserver } from 'mobx-react';
import { useEffect } from 'react';
import { translate } from '../../../../../../common/intl';
import { DocumentRevisionStatus } from '../../../../../../state/ducks/documentRevisions/types';
import FBAutocompleteAsyncState from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.state';
import FBAutocompleteAsyncStore from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { FBAutocompleteAsyncOption } from '../../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../../helpers';
import { customEQOptionType, EquipOption } from '../column.templates/types';

const isValidDate = (date?: string): boolean => Boolean(date && !Number.isNaN(Date.parse(date)));

const parseEquipmentOption = (equipment: EquipOption): customEQOptionType => {
  const { id, name, eqStatus, displayRevision, document, precalc } = equipment;
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

    return {
      equipmentOptions,
      allowedEditEqOptions,
    };
  });
};

export const useEquipmentOptions = (id: string) => {
  const optionId = FBAutocompleteAsyncOption.equipmentSpecifications;
  const autocompleteAsyncState = FB.useRef<FBAutocompleteAsyncState>(FBAutocompleteAsyncState, { optionId });

  useEffect(() => {
    if (id && optionId) {
      autocompleteAsyncState.setOptionId(optionId);
      autocompleteAsyncState.fetchAutocompleteOption(id, optionId);
    }
  }, [autocompleteAsyncState, id, optionId]);

  return useObserver(() => {
    if (!optionId) {
      return {
        equipmentSpcOptions: [],
        allowedEditEqSpecOptions: [],
      };
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
    const equipmentSpecs = Array.from(asyncData?.values() ?? []) ?? [];
    const equipmentSpcOptions = equipmentSpecs.map(parseEquipmentOption);
    const allowedEditEqSpecOptions = filterByRestrictedStatus(equipmentSpecs).map(parseEquipmentOption);

    return {
      equipmentSpcOptions,
      allowedEditEqSpecOptions,
    };
  });
};
