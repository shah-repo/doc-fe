import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { noop } from 'lodash';
import React from 'react';
import { Attachment } from '../../../../change.request/form/types';
import { CustomGridCellProps } from '../../../KendoDataGrid/KendoDataGrid.types';

interface DragContextProps {
  reorder: (dataItem: Attachment) => void
  dragStart: (dataItem: Attachment) => void
}
export const DragContext = React.createContext<DragContextProps>({ reorder: noop, dragStart: noop });

const styles = makeStyles((theme: Theme) => createStyles({
  cell: {
    textOverflow: 'initial !important',
  },
  dragElement: {
    cursor: 'move',
  },
  dragIcon: {
    width: 16,
    height: 16,
  },
}));

interface Props extends CustomGridCellProps {
  dataItem: Attachment
}

const DragCell: React.FC<Props> = (props) => {
  const classes = styles();
  const context = React.useContext(DragContext);

  return (
    <td
      className={classes.cell}
      onDragOver={(e) => {
        context.reorder(props.dataItem);

        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
    >
      <span
        className={classes.dragElement}
        draggable
        onDragStart={(e) => {
          context.dragStart(props.dataItem);
          e.dataTransfer.setData('dragging', '');
        }}
      >
        <FontAwesomeIcon icon={regular('grip-dots-vertical')} className={classes.dragIcon} />
      </span>
    </td>
  );
};

export default DragCell;
