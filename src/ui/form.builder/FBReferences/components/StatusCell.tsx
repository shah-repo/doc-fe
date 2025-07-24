import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import useStyles from '../../../../../src/ui/components/common/kendo.column.templates/Status.styles';
import { statusClassMapping } from '../../../components/common/kendo/helpers';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { Mode, MODE_FIELD } from '../../../components/KendoDataGrid/constants';
import { getStatusLabel } from '../../../dashboard.new/line.items/common/DocIcon';
import { configureStatus } from '../../../hooks/docCustomization/useCustomization';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableReference } from '../types';

export const StatusCell: React.FC<CustomTemplateProps> = ({ dataItem, field }) => {
  const classes = useStyles();
  let defaultValue = dataItem[field];
  const formik = useFormikContext<EditableReference>();

  if ([Mode.add, Mode.edit].includes(dataItem[MODE_FIELD])) {
    defaultValue = formik?.values.status || defaultValue;
  }

  const displayStatus = getStatusLabel('', configureStatus(defaultValue), '');

  if (!defaultValue) {
    return <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  return (
    <Tooltip
      data={displayStatus}
      childrenElement={
        <Chip
          size="small"
          data-cy="status-value"
          className={cx(classes.chip, classes[statusClassMapping[defaultValue]])}
          label={displayStatus}
        />
      }
    />
  );
};
