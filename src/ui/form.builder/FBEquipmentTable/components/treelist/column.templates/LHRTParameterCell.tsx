import { useFormikContext } from 'formik';
import React, { ChangeEvent, memo } from 'react';
import { Checkbox, FormikField } from '../../../../../components/forms/fields-next';
import { EditableEquipmentItem } from '../../../interface';
import { isEditEquipItem } from '../utils';
import { styles } from './styles';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

const LHRTParameterCell: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, hasChildren } = props;
  const isEditMode = isEditEquipItem(dataItem);
  const { getFieldProps, setFieldValue, values } = useFormikContext<EditableEquipmentItem>();
  const classes = styles({ hasChildren, isEditMode });

  const handleExpiredLotChange = (_: ChangeEvent<{}>, checked: boolean) => {
    setFieldValue(field, !!checked);
  };

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode && (
        <FormikField name={field} className={classes.activeCheckbox}>
          <Checkbox checked={values[field]} {...getFieldProps(field)} onChange={handleExpiredLotChange} />
        </FormikField>
      )}
      {!isEditMode && <Checkbox checked={dataItem[field]} disabled={true} />}
    </TreeListCellWrapper>
  );
};

export default memo(LHRTParameterCell);
