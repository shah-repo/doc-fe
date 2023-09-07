import { Chip, Grid } from '@material-ui/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React from 'react';
import { MODE_FIELD, Mode } from '../../../../../components/KendoDataGrid/constants';
import { styles } from '../../../../../components/common/kendo.column.templates/Status.styles';
import Tooltip from '../../../../../components/common/kendo/Tooltip';
import { statusClassMapping } from '../../../../../components/common/kendo/helpers';
import { EditableAlternatePart } from '../../treelist/interface';
import { CustomTemplateProps } from '../types';

export const StatusCell: React.FC<CustomTemplateProps> = ({ dataItem, field, onClick }) => {
  const classes = styles();
  const { values } = useFormikContext<EditableAlternatePart>();
  const isAddMode = [Mode.add].includes(dataItem[MODE_FIELD]);
  const status = (isAddMode ? values.status ?? dataItem[field] : dataItem[field]) as string;
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
            className={classNames(
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
