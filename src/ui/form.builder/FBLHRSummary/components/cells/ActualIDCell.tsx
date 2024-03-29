import { useFormikContext } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { translate } from '../../../../../common/intl';
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
import AutocompleteAsync from './AutocompleteAsync';

type ActualIDCellProps = {equipmentDocs: EquipmentDocument[], partDocs: PartDocument[]} & CustomTemplateProps;

export const ActualIDCell: React.FC<ActualIDCellProps> = ({ dataItem, field, equipmentDocs, partDocs, dataIndex }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { values, getFieldProps, setFieldValue } = useFormikContext<EditableLHRSummaryItem>();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const docType = isEditMode ? values.type : dataItem.type;
  const isMaterial = docType === DocType.material;
  const [actualId, setActualId] = useState<string>();

  const defaultValue = isEditMode ? values[field] : dataItem[field];

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

  const getOptionId = () => {
    if (isMaterial) {
      return FBAutocompleteAsyncOption.availableParts;
    } else {
      return FBAutocompleteAsyncOption.equipment;
    }
  };

  if (isEditMode) {
    const handleChange = (event: ChangeEvent<unknown>, value) => {
      // {id: 'enter value', revId: selectedValue, isNew: false}
      setFieldValue(field, value?.id);
    };
    return (
      <FormikField name={field}>
        <AutocompleteAsync
          {...getFieldProps(field)}
          key={docType}
          blurOnSelect
          freeSolo
          forcePopupIcon
          disableClearable
          optionId={getOptionId()}
          onChange={handleChange}
          placeholder={translate('lhr.summary.placeholder.select.enter')}
          size="small"
        />
      </FormikField>
    );
  }

  return <>{actualId ?? defaultValue ?? EMPTY_PLACEHOLDER}</>;
};
