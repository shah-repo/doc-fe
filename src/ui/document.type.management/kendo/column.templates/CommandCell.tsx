import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { useIntl } from 'react-intl';
import Tooltip from '../../../components/common/kendo/Tooltip';
import { CellCommandConfig } from '../types';
import CellStyles from './CellStyles';

export const CommandCell: React.FunctionComponent<CellCommandConfig> = ({
  dataItem,
  rowType,
  colSpan,
  style,
  className,
  columnIndex,
  disabled,
  add,
  update,
  cancel,
  edit,
  remove,
}) => {

  const classes = CellStyles();
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const inEdit = dataItem.inEdit;
  const isNewItem = dataItem.id === undefined;
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
        data={getTranslatedText('common.add.document.type')}
        childrenElement={
          <span>
            <IconButton
              disableFocusRipple
              disableRipple
              className={classes.iconButton}
              disabled={disabled}
              onClick={() =>
                isNewItem ? add(dataItem) : update(dataItem)
              }
            >
              <AddCircleOutlineIcon
                className={disabled ? '' : classes.ButtonColor}
                fontSize="small"
                color={disabled ? 'disabled' : 'secondary'}
              />
            </IconButton>
          </span>
        }
      />
      <Tooltip
        placement="top"
        data={getTranslatedText('common.discard')}
        childrenElement={
          <span>
            <IconButton
              disableFocusRipple
              disableRipple
              disabled={disabled}
              className={classes.iconButton}
              onClick={() => cancel(dataItem)}
            >
              <CancelOutlinedIcon
                className={disabled ? '' : classes.Cancel}
                fontSize="small"
                color={disabled ? 'disabled' : 'secondary'}
              />
            </IconButton>
          </span>
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
        data={getTranslatedText('common.edit.document.type')}
        childrenElement={
          <span>
            <IconButton
              disableFocusRipple
              disableRipple
              disabled={disabled}
              className={classes.iconButton}
              onClick={() => edit(dataItem)}
            >
              <EditIcon
                className={disabled ? '' : classes.ButtonColor}
                fontSize="small"
                color={disabled ? 'disabled' : 'secondary'}
              />
            </IconButton>
          </span>
        }
      />
      <Tooltip
        placement="top"
        data={getTranslatedText('common.delete.document.type')}
        childrenElement={
          <span>
            <IconButton
              disableFocusRipple
              disableRipple
              disabled={disabled}
              className={classes.iconButton}
              onClick={() => remove(dataItem)}
            >
              <DeleteIcon
                className={disabled ? '' : classes.Remove}
                fontSize="small"
                color={disabled ? 'disabled' : 'secondary'}
              />
            </IconButton>
          </span>
        }
      />
    </td>
  );
};
