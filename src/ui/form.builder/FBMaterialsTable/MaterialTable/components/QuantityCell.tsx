import { useFormikContext } from 'formik';
import React from 'react';
import { MaterialTreelistContext } from '..';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import { requiredNumber, validator } from '../../../../components/forms/fields/validators';
import { toFixed } from '../../../../dashboard.new/line.items/common/Utils';
import { CELL_EMPTY_VALUE, MAX_DECIMALS } from '../constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';
import { isEditMaterial } from './utils';

const QuantityCell: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { dataItem, field = '', hasChildren, isLHRT } = props;
  const classes = styles({ hasChildren });
  const { getFieldProps, setFieldValue, values } = useFormikContext<EditableMaterial>();
  const isEditMode = isEditMaterial(dataItem);
  const { lhrsQuantity = 1 } = React.useContext(MaterialTreelistContext);

  const onQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (!isNaN(Number(val)) && Number(val) >= 0 && field) {
      setFieldValue(field, Number(val));
    }
  };

  const shouldDisable = !isLHRT && values?.LHRTparameter;

  const getFieldInfo = () =>
    field && (
      <FormikField name={field} {...(!shouldDisable && { validate: validator(requiredNumber) })}>
        <TextField
          {...getFieldProps(field)}
          type="number"
          onChange={onQuantityChange}
          inputProps={{ min: 0 }}
          disabled={shouldDisable}
          size="small"
        />
      </FormikField>
    );

  let displayValue = dataItem[field] ? Number(toFixed(dataItem[field], MAX_DECIMALS)) : CELL_EMPTY_VALUE;

  if (dataItem.title && typeof displayValue === 'number') {
    displayValue = displayValue * lhrsQuantity;
  }

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode && getFieldInfo()}
      {!isEditMode && <span className={classes.Cell}>{displayValue}</span>}
    </TreeListCellWrapper>
  );
};

export default QuantityCell;
