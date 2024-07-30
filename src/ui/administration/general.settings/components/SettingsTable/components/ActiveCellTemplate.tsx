import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { CellTemplateProps, EditableItem } from '../../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { Checkbox, FormikField } from '../../../../../components/forms/fields-next';

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

  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  return (
    <Box display="flex" justifyContent="center">
      {isEditMode && (
        <FormikField name={field}>
          <Checkbox
            checked={getFieldMeta<boolean>(field).value}
            {...getFieldProps(field)}
          />
        </FormikField>
      )}
      {!isEditMode && (
        <Checkbox
          checked={dataItem.active}
          onChange={(e, checked) => onActiveStateChange?.(dataItem, checked)}
          disabled={!onActiveStateChange}
        />
      )}
    </Box>
  );
}

export default ActiveCellTemplate;
