import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React from 'react';
import { translate } from '../../../../../../../common/intl';
import OverflowingContent from '../../../../../../change.request/FBMaterialDisposition/components/commonCells/OveflowContent';
import {
  Autocomplete,
  FormikField,
} from '../../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../../components/KendoDataGrid/constants';
import { CustomCellProps } from '../types';

const Editor: React.FC<CustomCellProps> = ({
  dataItem,
  dataIndex,
  field,
  dataOptions,
  onChange,
}) => {
  const { getFieldProps, setFieldValue } = useFormikContext();

  const handleChange = (e, value: string) => {
    setFieldValue(field, value);
    onChange?.({
      dataIndex,
      dataItem,
      syntheticEvent: e.syntheticEvent,
      field,
      value,
    });
  };

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        blurOnSelect
        disableClearable
        placeholder={translate('common.select')}
        options={dataOptions}
        data-cy={`${kebabCase(field)}-field`}
        onChange={handleChange}
        size="small"
      />
    </FormikField>
  );
};

export const SupplierDropDownCell: React.FC<CustomCellProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const handleClick = () => onClick?.({ dataItem });
  const dataCy = `${kebabCase(field)}-td`;
  console.log('dataItem :', dataItem, field);

  return (
    <Box display="flex" justifyContent="start" data-cy={dataCy} onClick={handleClick}>
      {isEditMode && <Editor {...props} />}
      {!isEditMode && (
        <OverflowingContent onClick={handleClick} data-cy={dataCy}>
          {dataItem[field].map(item => item.text).join(', ')}
        </OverflowingContent>
      )}
    </Box>
  );
};
