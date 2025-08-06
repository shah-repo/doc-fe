import { useFormikContext } from 'formik';
import React from 'react';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import { toFixed } from '../../../../dashboard.new/line.items/common/Utils';
import { MAX_DECIMALS } from '../constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';
import { getCellValue, isEditMaterial } from './utils';

const QuantityCell: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { dataItem, field, hasChildren } = props;
  const classes = styles({ hasChildren });
  const { getFieldProps, setFieldValue } = useFormikContext<EditableMaterial>();
  const isEditMode = isEditMaterial(dataItem);

  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (!isNaN(Number(val)) && Number(val) >= 0 && field) {
      setFieldValue(field, Number(val));
    }
  };

  const getFieldInfo = () =>
    field && (
      <FormikField name={field}>
        <TextField
          {...getFieldProps(field)}
          type="number"
          onChange={onQuantityChange}
          inputProps={{ min: 0 }}
          size="small"
        />
      </FormikField>
    );

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode && getFieldInfo()}
      {!isEditMode && <span className={classes.Cell}>{toFixed(getCellValue(dataItem, field), MAX_DECIMALS)}</span>}
    </TreeListCellWrapper>
  );
};

export default QuantityCell;
