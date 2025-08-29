import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent, memo } from 'react';
import OverflowContent from '../../../../components/OverflowContent';
import { Autocomplete, FormikField } from '../../../../components/forms/fields-next';
import { CELL_EMPTY_VALUE } from '../constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import TreeListCellWrapper from './TreeListCellWrapper';
import { isEditMaterial } from './utils';

const Editor: React.FC<CustomTreeListCellProps> = ({ field = '', units }) => {
  const { values, setFieldValue, getFieldProps } = useFormikContext<EditableMaterial>();

  const handleChange = (_: ChangeEvent<unknown>, value?: string) => {
    setFieldValue(field, value);
  };

  const value = values[field] as string;

  return (
    <FormikField name={field}>
      <Autocomplete
        {...getFieldProps(field)}
        key={isEmpty(units) ? 'disabled' : 'enabled'}
        blurOnSelect
        options={units}
        onChange={handleChange}
        value={value}
        size="small"
        disabled={isEmpty(units) || values.LHRTparameter}
      />
    </FormikField>
  );
};

const UnitsCellTemplate: React.FC<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem } = props;
  const isEditMode = isEditMaterial(dataItem);
  const displayValue = get(dataItem, field, CELL_EMPTY_VALUE) as string;

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode ? <Editor {...props} /> : <OverflowContent>{displayValue}</OverflowContent>}
    </TreeListCellWrapper>
  );
};

export default memo(UnitsCellTemplate);
