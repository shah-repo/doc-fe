import { useFormikContext } from 'formik';
import React, { ChangeEvent, memo } from 'react';
import { Checkbox } from '../../../../../components/forms/fields-next';
import { EditableEquipmentItem } from '../../../interface';
import { isEditEquipItem } from '../utils';
import TreeListCellWrapper from './TreelistCellWrapper';
import { CustomTreeListCellProps } from './types';

const LHRTParameterCell: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem } = props;
  const isEditMode = isEditEquipItem(dataItem);
  const { getFieldProps, setFieldValue, values } = useFormikContext<EditableEquipmentItem>();

  const handleExpiredLotChange = (_: ChangeEvent<{}>, checked: boolean) => {
    setFieldValue(field, !!checked);
  };

  const checkboxProps = {
    checked: isEditMode ? values[field] : dataItem[field],
    disabled: !isEditMode,
    ...(isEditMode && {
      ...getFieldProps(field),
      onChange: handleExpiredLotChange,
    }),
  };

  return (
    <TreeListCellWrapper {...props}>
      <Checkbox {...checkboxProps} />
    </TreeListCellWrapper>
  );
};

export default memo(LHRTParameterCell);
