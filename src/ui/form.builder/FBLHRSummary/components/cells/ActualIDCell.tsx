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

type ActualIDCellProps = {equipmentDocs: EquipmentDocument[], partDocs: PartDocument[]} & CustomTemplateProps;

export const ActualIDCell: React.FC<ActualIDCellProps> = ({ dataItem, field, equipmentDocs, partDocs, dataIndex }) => {
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const docType = dataItem.type;
  const isMaterial = docType === DocType.material;
  const [actualId, setActualId] = useState<string>();

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

    setActualId(value?.docId);
  }, [equipmentDocs, partDocs]);

  if (isEditMode) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
    const docType = values.type;

    const getOptionId = () => {
      if (docType === DocType.material) {
        return FBAutocompleteAsyncOption.releasedParts;
      } else {
        return FBAutocompleteAsyncOption.equipment;
      }
    };

    const handleChange = (event: ChangeEvent<unknown>, value) => {
      // {id: 'enter value', revId: selectedValue, isNew: false}
      setFieldValue(field, value?.id);
    };

    const handleFilter = (
      data: DocumentRevision[],
      state: FilterOptionsState,
    ) => {
      const { inputValue = '' } = state || {};

      const options = data?.filter((docRev) => (docRev.status === DocumentRevisionStatus.Released)
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

  return <>{actualId ?? defaultValue ?? EMPTY_PLACEHOLDER}</>;
};
