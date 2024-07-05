import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { GridRowProps } from '@progress/kendo-react-grid';
import * as React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { IconButton } from '../../../../../../../components/forms/fields-next';
import useStyles from './styles';

interface GroupHeaderCellProps extends GridRowProps {
}

export const GroupHeaderCell: React.FC<GroupHeaderCellProps> = (props) => {
  const classes = useStyles();
  // onClick={() => handleExpandCollapse(props.dataItem)}

  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item alignItems="center">
        <FontAwesomeIcon
          data-cy="minimize-row-button"
          // onClick={hasChildren ? onClick : undefined}
          size="sm"
          style={{ paddingRight: '10px' }}
          icon={
            props.dataItem.expanded ? solid('square-plus') : regular('square-minus')
          }
        />
        <span>{props.dataItem.value}</span>
      </Grid>
      <Grid item>
        <Tooltip title={translate('common.edit')} placement="top">
          <IconButton
            kind="simple"
            color="primary"
            style={{ marginRight: '10px' }}
            // onClick={() => onEdit(dataItem, dataIndex)}
          >
            <FontAwesomeIcon
              icon={regular('pen-to-square')}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title={translate('common.delete')} placement="top">
          <IconButton
            kind="simple"
            // onClick={() => onDelete(dataItem)}
            className={classes.deleteButton}
          >
            <FontAwesomeIcon
              icon={regular('trash-can')}
            />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
