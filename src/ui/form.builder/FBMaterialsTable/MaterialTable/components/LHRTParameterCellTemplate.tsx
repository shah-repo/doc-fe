import { useFormikContext } from 'formik';
import React, { ChangeEvent, memo } from 'react';
import { Checkbox, FormikField } from '../../../../components/forms/fields-next';
import { MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { ADD_FIELD } from '../../../FBAllocation/components/treelist/constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

const LHRTParameterCellTemplate: React.ComponentType<CustomTreeListCellProps> = (props) => {
  const { field = '', dataItem, hasChildren } = props;
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && !dataItem.lotId && !dataItem?.isLotAddition;
  const { getFieldProps, setFieldValue, values } = useFormikContext<EditableMaterial>();
  const classes = styles({ hasChildren, isEditMode });

  const handleExpiredLotChange = (event: ChangeEvent<{}>, checked: boolean) => {
    setFieldValue(field, !!checked);
    if (!checked) {
      setFieldValue('title', '');
    }
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

export default memo(LHRTParameterCellTemplate);
