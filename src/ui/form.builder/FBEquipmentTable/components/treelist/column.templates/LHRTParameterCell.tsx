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

  return (
    <TreeListCellWrapper {...props}>
      {isEditMode && (
        <Checkbox checked={values[field]} {...getFieldProps(field)} onChange={handleExpiredLotChange} />
      )}
      {!isEditMode && <Checkbox checked={dataItem[field]} disabled={true} />}
    </TreeListCellWrapper>
  );
};

export default memo(LHRTParameterCell);
