import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { statusClassMapping } from '../../../components/common/kendo/helpers';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { getStatusLabel } from '../../../dashboard.new/line.items/common/DocIcon';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableProductORService } from '../types';
import useStyles from './Status.styles';

export const StatusCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  ...props
}) => {
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  let defaultValue = dataItem[field];
  const formik = useFormikContext<EditableProductORService>();

  if (isEditMode) {
    defaultValue = formik?.values.status || dataItem[field];
  }

  const displayStatus = getStatusLabel('', defaultValue, '');

  if (defaultValue) {
    return <Tooltip
      data={displayStatus}
      childrenElement={
        <Chip
          size="small"
          className={cx(
            classes.chip,
            classes[statusClassMapping[displayStatus]],
          )}
          label={displayStatus}
        />
      }
    />;
  }

  return <>{EMPTY_VALUE_PLACEHOLDER}</>;
};
