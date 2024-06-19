import { Chip } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { LotStatus } from '../../../../../state/ducks/documentRevisions/types';
import { getLotStatusLabel } from '../../../../components/common/header/HeaderLotStatus';
import { statusClassMapping } from '../../../../components/common/kendo/helpers';
import Tooltip from '../../../../components/common/kendo/Tooltip';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import { EMPTY_PLACEHOLDER } from '../../constants';
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
  const formik = useFormikContext<EditableLHRSummaryItem>();

  if (isEditMode) {
    defaultValue = formik?.values.status || dataItem[field];
  }

  const displayStatus = getLotStatusLabel(defaultValue as LotStatus);

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

  return <>{EMPTY_PLACEHOLDER}</>;
};
