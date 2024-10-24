import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { Checkbox, FormikField } from '../../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import useStyles from '../styles';

interface EditableItemWithActiveField extends EditableItem {
  active: boolean
}

interface Props<T extends EditableItemWithActiveField> extends CellTemplateProps<T> {
  onActiveStateChange?: (item: T, active: boolean) => void
}

function ActiveCellTemplate<T extends EditableItemWithActiveField> ({
  dataItem,
  field,
  onActiveStateChange,
}: Props<T>): React.ReactElement {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, getFieldMeta } = useFormikContext();

  const classes = useStyles();

  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  return (
    <Box display="flex" justifyContent="center">
      {isEditMode && (
        <FormikField
          name={field}
          className={classes.activeCheckbox}
        >
          <Checkbox
            checked={Boolean(getFieldMeta(field).value)}
            {...getFieldProps(field)}
          />
        </FormikField>
      )}
      {!isEditMode && (
        <Checkbox
          checked={dataItem.active ?? dataItem?.isActive}
          onChange={(e, checked) => onActiveStateChange?.(dataItem, checked)}
          disabled={!onActiveStateChange}
        />
      )}
    </Box>
  );
}

export default ActiveCellTemplate;
