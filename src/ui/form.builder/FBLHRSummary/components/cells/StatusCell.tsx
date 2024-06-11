import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { statusClassMapping } from '../../../../components/common/kendo/helpers';
import Tooltip from '../../../../components/common/kendo/Tooltip';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { EMPTY_PLACEHOLDER, STATUS_OPTIONS } from '../../constants';
import { CustomTemplateProps, EditableLHRSummaryItem } from '../../types';
import useStyles from './Status.styles';

export const StatusCell: React.FC<CustomTemplateProps> = ({
  dataItem,
  field,
  ...props
}) => {
  const classes = useStyles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  let defaultValue = dataItem[field];

  if (isEditMode) {
    const { values } = useFormikContext<EditableLHRSummaryItem>();
    defaultValue = values.status || dataItem[field];
  }

  const displayStatus = STATUS_OPTIONS.find((option) => option.value === defaultValue)?.label ?? defaultValue;

  return (
    <>
      {displayStatus ? (
        <Tooltip
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
        />
      ) : (
        EMPTY_PLACEHOLDER
      )}
    </>
  );
};
