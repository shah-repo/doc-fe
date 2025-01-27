import { getter } from '@progress/kendo-data-query';
import { getSelectedState } from '@progress/kendo-react-data-tools';
import { GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import React from 'react';
import { AttachmentType } from '../../../../state/ducks/attachments/types';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { Attachment } from '../../../change.request/form/types';
import KendoDataGrid from '../../KendoDataGrid/KendoDataGrid';
import { buildSchema } from './schema';
import { DragAndDrop } from '@progress/kendo-react-common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { isEmpty, isNull } from 'lodash';

const styles = makeStyles((theme: Theme) =>
  createStyles({
    dragIcon: {
      width: 16,
      height: 16,
    },
  }));

const SELECTED_FIELD = 'selected';
const DATA_ITEM_KEY = 'id';
const idGetter = getter(DATA_ITEM_KEY);

interface ContextProps {
  reorder: (dataItem: any) => void
  dragStart: (dataItem: any) => void
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
const MyContext = React.createContext<ContextProps>({ reorder: (dataItem) => { }, dragStart: (dataItem) => { } });

export const DragCell = (props) => {
  const classes = styles();
  const currentContext = React.useContext(MyContext);
  return (
    <td
      style={{ textOverflow: 'initial' }}
      onDragOver={(e) => {
        currentContext.reorder(props.dataItem);

        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
    >
      <span
        draggable={true}
        style={{ cursor: 'move' }}
        onDragStart={(e) => {
          currentContext.dragStart(props.dataItem);
          e.dataTransfer.setData('dragging', '');
        }}
      >
        <FontAwesomeIcon icon={regular('grip-dots-vertical')} className={classes.dragIcon} />
      </span>
    </td>
  );
};

interface Props {
  documentRevision: DocumentRevision
  onDownloadAttachment?: (attachment: Attachment, type?: AttachmentType) => any
  onDownloadAsPDF?: (attachment: Attachment, attachmentType: AttachmentType) => void
  onView?: (attachment: Attachment) => any
  onDelete?: (attachment: Attachment) => () => any
  selectedAttachments?: { [id: string]: boolean | number[] }
  onSelectedAttachmentsChange?: (selectedAttachments: { [id: string]: boolean | number[] }) => void
}

const AttachmentTable: React.FC<Props> = ({
  documentRevision,
  selectedAttachments,
  onDownloadAttachment,
  onDownloadAsPDF,
  onView,
  onDelete,
  onSelectedAttachmentsChange,
}) => {
  const [attachmentsData, setAttachmentsData] = React.useState(documentRevision?.attachments ?? []);
  const [headerChecked, setHeaderChecked] = React.useState(false);

  const [activeItem, setActiveItem] = React.useState<any | null>(null);

  const reorder = (dataItem: any) => {
    if (activeItem === dataItem) {
      return;
    }
    const reorderedData = attachmentsData.slice();
    const prevIndex = reorderedData.findIndex((p) => p === activeItem);
    const nextIndex = reorderedData.findIndex((p) => p === dataItem);
    reorderedData.splice(prevIndex, 1);
    reorderedData.splice(nextIndex, 0, activeItem || reorderedData[0]);

    setAttachmentsData(reorderedData);
  };

  // Sets the item being dragged as the active item
  const dragStart = (dataItem: any) => {
    setActiveItem(dataItem);
  };

  const handleHeaderCheckedChange = (event: CheckboxChangeEvent) => {
    setHeaderChecked(Boolean(event.target.value));
    if (event.target.value) {
      const checkedItems = {} as { [id: string]: boolean | number[] };
      attachmentsData.forEach(element => {
        if (!selectedAttachments?.[idGetter(element)]) {
          checkedItems[element.id] = true;
        }
      });
      onSelectedAttachmentsChange?.(checkedItems);
    } else {
      onSelectedAttachmentsChange?.({});
    }
  };

  const onSelectionChange = (event: GridSelectionChangeEvent) => {
    const { dataItem } = event;
    if (isNull(dataItem)) {
      return;
    }
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedAttachments ?? {},
      dataItemKey: DATA_ITEM_KEY,
    });
    onSelectedAttachmentsChange?.(newSelectedState);
    const selectedAttachmentsCount = Object.values(newSelectedState).filter(value => value === true).length;
    if (selectedAttachmentsCount === attachmentsData.length) {
      setHeaderChecked(true);
    } else {
      setHeaderChecked(false);
    }
  };

  const schema = buildSchema({
    headerChecked,
    documentRevision,
    onDownloadAttachment,
    onDownloadAsPDF,
    onDelete,
    onView,
    handleHeaderCheckedChange,
  });

  React.useEffect(() => {
    const data = attachmentsData.map((list) => ({ ...list, [SELECTED_FIELD]: Boolean(selectedAttachments?.[idGetter(list)]) }));
    setAttachmentsData(data);
  }, [selectedAttachments]);

  React.useEffect(() => {
    setAttachmentsData(documentRevision?.attachments);
  }, [documentRevision?.attachments]);

  if (isEmpty(documentRevision?.attachments)) {
    return null;
  }

  return (
    <MyContext.Provider value={{ reorder: reorder, dragStart: dragStart }}>
      <DragAndDrop>
        <KendoDataGrid
          fullWidth
          sortable
          filterable
          hasBoxScrollbars
          schema={schema}
          data={attachmentsData}
          selectedField={SELECTED_FIELD}
          dataItemKey={DATA_ITEM_KEY}
          selectable={{
            enabled: true,
            drag: false,
            cell: true,
            mode: 'multiple',
          }}
          onSelectionChange={onSelectionChange}
        />
      </DragAndDrop>
    </MyContext.Provider>
  );
};

export default AttachmentTable;
