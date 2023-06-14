import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import EditIcon from '@material-ui/icons/Edit';
import { GridRowClickEvent } from '@progress/kendo-react-grid';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { GroupRequestBody } from '../../../../state/ducks/groupManagement/types';
import { LoadCompanyGroup } from '../../../../state/ducks/userManagement/types';
import Tooltip from '../../../components/common/kendo/Tooltip';
import Commandstyles from './CommandCell.styles';

interface CommandCellProps {
  dataItem: any
  rowType?: string
  colSpan?: number
  style?: React.CSSProperties
  className?: string
  columnIndex?: number
  update: ((props: GroupRequestBody) => void)
  discard: ((props: LoadCompanyGroup) => void)
  cancel: (() => void)
  edit: ((props: GridRowClickEvent) => void)
}

export const CommandCell = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  update,
  cancel,
  edit,
}: CommandCellProps) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const classes = Commandstyles();
  const inEdit = dataItem.inEdit;

  if (rowType === 'groupHeader') {
    return null;
  }

  return inEdit ? (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Tooltip
        placement="top"
        data={getTranslatedText('common.add.group')}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => update(dataItem)}
            className={classes.button}
          >
            <AddCircleOutlineIcon
              className={classes.ButtonColor}
              fontSize="small"
            />
          </IconButton>
        }
      />
      <Tooltip
        placement="top"
        data={getTranslatedText('common.discard')}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => cancel()}
            className={classes.button}
          >
            <CancelOutlinedIcon className={classes.Cancel} fontSize="small" />
          </IconButton>
        }
      />
    </td>
  ) : (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
    >
      <Tooltip
        placement="top"
        data={getTranslatedText('common.edit.group')}
        childrenElement={
          <IconButton
            disableRipple={true}
            size="small"
            onClick={() => edit(dataItem)}
            className={classes.button}
          >
            <EditIcon className={classes.ButtonColor} fontSize="small" />
          </IconButton>
        }
      />
    </td>
  );
};
