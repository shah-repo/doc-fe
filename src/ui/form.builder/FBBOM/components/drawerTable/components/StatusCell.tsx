import { Chip, Grid } from '@material-ui/core';
import cx from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import useStyles from '../../../../../components/common/kendo.column.templates/Status.styles';
import { statusClassMapping } from '../../../../../components/common/kendo/helpers';
import Tooltip from '../../../../../components/common/kendo/Tooltip';
import { Mode, MODE_FIELD } from '../../../../../components/KendoDataGrid/constants';
import { EditableAlternatePart } from '../../treelist/interface';
import { CustomTemplateProps } from '../types';

export const StatusCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const classes = useStyles();
  const { values } = useFormikContext<EditableAlternatePart>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const status = (isAddMode ? values[field] ?? dataItem[field] : dataItem[field]) as string;
  const onRowClick = (evt) => {
    if (!onClick) { return; }
    evt.preventDefault();
    onClick({ dataItem });
  };
  return (
    <Grid
      container
      direction="row"
      alignContent="flex-start"
      justify="flex-start"
      onClick={onRowClick}>
      <Tooltip
        data={status}
        childrenElement={<span>
          {status && <Chip
            size="small"
            className={cx(
              classes.chip,
              classes[statusClassMapping[status]],
            )}
            label={status}
          />}
        </span>
        }
      />
    </Grid>
  );
};
