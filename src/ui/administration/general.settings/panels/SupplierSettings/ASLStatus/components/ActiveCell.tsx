import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import React from 'react';
import {
  Checkbox,
  FormikField,
} from '../../../../../../components/forms/fields-next';
import {
  Mode,
  MODE_FIELD,
} from '../../../../../../components/KendoDataGrid/constants';
import useStyles from '../../../../components/SettingsTable/styles';
import { CustomCellProps } from '../types';

function ActiveCell ({
  dataItem,
  field,
  onActiveStateChange,
}: CustomCellProps): React.ReactElement {
  const { getFieldProps, getFieldMeta } = useFormikContext();
  const classes = useStyles();
  const dataCy = kebabCase(field);
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  return (
    <Box display="flex" justifyContent="center" data-cy={`${dataCy}-td`}>
      {isEditMode && (
        <FormikField
          name={field}
          className={classes.activeCheckbox}
          data-cy={`${dataCy}-field`}
        >
          <Checkbox
            checked={Boolean(getFieldMeta(field).value)}
            {...getFieldProps(field)}
          />
        </FormikField>
      )}
      {!isEditMode && (
        <Checkbox
          checked={dataItem.isActive}
          onChange={(e, checked) => onActiveStateChange?.(dataItem, checked)}
          disabled={!onActiveStateChange}
          data-cy={`${dataCy}-value`}
        />
      )}
    </Box>
  );
}

export default ActiveCell;
