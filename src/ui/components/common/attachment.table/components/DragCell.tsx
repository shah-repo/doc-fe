import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noop } from 'lodash';
import React from 'react';
import { Attachment } from '../../../../change.request/form/types';
import { CustomGridCellProps } from '../../../KendoDataGrid/KendoDataGrid.types';
import { useStyles } from '../styles';

interface DragContextProps {
  reorder: (dataItem: Attachment) => void
  dragStart: (dataItem: Attachment) => void
}
export const DragContext = React.createContext<DragContextProps>({ reorder: noop, dragStart: noop });

interface Props extends CustomGridCellProps {
  dataItem: Attachment
}

const DragCell: React.FC<Props> = (props) => {
  const classes = useStyles();
  const context = React.useContext(DragContext);

  return (
    <td
      className={classes.dragCell}
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
