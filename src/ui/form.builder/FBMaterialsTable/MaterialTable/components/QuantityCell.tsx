import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { MaterialTreelistContext } from '..';
import { FormikField, TextField } from '../../../../components/forms/fields-next';
import { requiredNumber, validator } from '../../../../components/forms/fields/validators';
import { CELL_EMPTY_VALUE } from '../constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';
import { isEditMaterial } from './utils';

const QuantityCell: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { dataItem, field = '', hasChildren, isLHRT } = props;
  const classes = styles({ hasChildren });
  const { getFieldProps, values, errors, setErrors, setTouched, touched }
    = useFormikContext<EditableMaterial>();
  const isEditMode = isEditMaterial(dataItem);
  const { lhrsQuantity = 1, isEBProcedure } = React.useContext(MaterialTreelistContext);

  const shouldDisable = !isLHRT && values?.LHRTparameter;

  const getFieldInfo = () =>
    field && (
      <FormikField
        name={field}
        validate={!shouldDisable && !isEBProcedure ? validator(requiredNumber) : undefined}
        error={!shouldDisable && field ? Boolean(errors[field]) : undefined}
      >
        <TextField
          {...getFieldProps(field)}
          type="number"
          inputProps={{ min: 0 }}
          disabled={shouldDisable}
          size="small"
        />
      </FormikField>
    );

  let displayValue = dataItem[field] ? Number(dataItem[field]) : CELL_EMPTY_VALUE;

  if (dataItem.title && typeof displayValue === 'number') {
    displayValue = displayValue * lhrsQuantity;
  }

  useEffect(() => {
    if (shouldDisable && errors[field] && !isEBProcedure) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
      setTouched({
        ...touched,
        [field]: false,
      });
    }
  }, [shouldDisable]);

  return (
    <TreeListCellWrapper {...props} key={`${field}-${shouldDisable}`}>
      {isEditMode && getFieldInfo()}
      {!isEditMode && <span className={classes.Cell}>{displayValue}</span>}
    </TreeListCellWrapper>
  );
};

export default QuantityCell;
