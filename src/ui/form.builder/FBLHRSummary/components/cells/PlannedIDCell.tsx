import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { useFormikContext } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import {
  MODE_FIELD,
  Mode,
} from '../../../../components/KendoDataGrid/constants';
import {
  FormikField,
} from '../../../../components/forms/fields-next';
import { FBAutocompleteAsyncOption } from '../../../FBAutocompleteAsync/FBAutocompleteAsync.types';
import { FB } from '../../../helpers';
import { DocType, EMPTY_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem, EquipmentDocument, PartDocument } from '../../types';
import { filterOutOption } from '../../utils';
import AutocompleteAsync from './AutocompleteAsync';

type PlannedIDCellProps = {equipmentDocs: EquipmentDocument[], partDocs: PartDocument[]} & CustomTemplateProps;

export const PlannedIDCell: React.FC<PlannedIDCellProps> = ({
  dataItem,
  field,
  partDocs,
  equipmentDocs,
}) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const docType = dataItem.type;
  const isMaterial = docType === DocType.material;
  const [plannedId, setPlannedId] = useState<string>();
  const defaultValue = dataItem[field];

  useEffect(() => {
    if (!FB.isUUID(defaultValue)) {
      return;
    }

    let value;
    if (isMaterial) {
      value = partDocs.find((option) => option.id === defaultValue);
    } else {
      value = equipmentDocs.find((option) => option.id === defaultValue);
    }

    setPlannedId(value?.docId);
  }, [equipmentDocs, partDocs]);

  if (isEditMode) {
    const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
    const docType = values.type;
    const isMaterial = docType === DocType.material;

    const getOptionId = () => {
      if (isMaterial) {
        return FBAutocompleteAsyncOption.releasedParts;
      } else {
        return FBAutocompleteAsyncOption.equipment;
      }
    };

    const handleChange = (event: ChangeEvent<unknown>, value?) => {
      setFieldValue(field, value?.id);
    };

    const handleFilter = (
      data: DocumentRevision[],
      state: FilterOptionsState,
    ) => {
      const { inputValue = '' } = state || {};

      const options = data?.filter((docRev) => (isMaterial ? docRev.status === DocumentRevisionStatus.Released : true)
        && filterOutOption(docRev, inputValue));

      return options;
    };

    const filterOptions = (options, state) => handleFilter(options, state);

    return (
      <FormikField name={field} required>
        <AutocompleteAsync
          {...getFieldProps(field)}
          key={docType}
          blurOnSelect
          freeSolo
          forcePopupIcon
          disableClearable
          optionId={getOptionId()}
          {...{ filterOptions }}
          onChange={handleChange}
          placeholder={translate('lhr.summary.placeholder.select.enter')}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{plannedId ?? defaultValue ?? EMPTY_PLACEHOLDER}</>;
};
