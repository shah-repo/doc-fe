// import cx from 'classnames';
import { getter } from '@progress/kendo-data-query';
import { getSelectedState } from '@progress/kendo-react-data-tools';
import { GridColumn, GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import React from 'react';
import { AttachmentType } from '../../../../state/ducks/attachments/types';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { Attachment } from '../../../change.request/form/types';
import KendoDataGrid from '../../KendoDataGrid/KendoDataGrid';
import { buildSchema } from './schema';
import { DragAndDrop } from '@progress/kendo-react-common';
import { DraggableRow } from './components/DraggableRow';
import { DragHandleCell } from './components/DragHandleCell';

const SELECTED_FIELD = 'selected';
const DATA_ITEM_KEY = 'id';
const idGetter = getter(DATA_ITEM_KEY);

interface ContextProps {
  reorder: (dataItem: Attachment, direction: 'before' | 'after' | null) => void
  dragStart: (dataItem: Attachment) => void
}

export const ReorderContext = React.createContext<ContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reorder: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dragStart: () => {},
});

interface Props {
  documentRevision: DocumentRevision
  onDownloadAttachment?: (attachment: Attachment, type?: AttachmentType) => any
  onDownloadAsPDF?: (attachment: Attachment, attachmentType: AttachmentType) => void
  onView?: (attachment: Attachment) => any
  onDelete?: (attachment: Attachment) => () => any
  selectedAttachments?: {[id: string]: boolean | number[]}
  onSelectedAttachmentsChange?: (selectedAttachments: {[id: string]: boolean | number[]}) => void
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
  const [attachmentsData, setAttachmentsData] = React.useState(documentRevision.attachments);
  const [headerChecked, setHeaderChecked] = React.useState(false);

  // State to hold the grid's data and the item currently being dragged
  // const [gridData, setGridData] = React.useState<any[]>(attachmentsData);
  const [activeItem, setActiveItem] = React.useState<any | null>(null);

  const reorder = (dataItem: any, direction: 'before' | 'after' | null) => {
      if (activeItem === dataItem || direction === null) return; // No change if dropping in the same spot
      const reorderedData = [...attachmentsData]; // Create a copy of the data array

      // Locate the index of the item currently being dragged
      const prevIndex = reorderedData.findIndex((p) => p?.id === activeItem?.id);
      if (prevIndex === -1) return; // Exit if the active item isn't found
      // Determine the index where the active item should be placed
      let nextIndex = reorderedData.findIndex((p) => p?.id === dataItem?.id) + (direction === 'before' ? -1 : 0);

      if (prevIndex > nextIndex) nextIndex++;

      // Move the active item to the new position
      reorderedData.splice(prevIndex, 1); // Remove from the old position
      reorderedData.splice(nextIndex, 0, activeItem); // Insert at the new position

      setAttachmentsData(reorderedData); // Update the grid data state
      setActiveItem(null); // Clear the active item after drop
  };

  // Sets the item being dragged as the active item
  const dragStart = (dataItem) => {
      setActiveItem(dataItem);
  };

const handleHeaderCheckedChange = (event: CheckboxChangeEvent) => {
  setHeaderChecked(Boolean(event.target.value));
  if(event.target.value) {
    const checkedItems = {} as {[id: string]: boolean | number[]};
    attachmentsData.forEach(element => {
      if(!selectedAttachments?.[idGetter(element)]) {
        checkedItems[element.id] = true;
      }
    });
    onSelectedAttachmentsChange?.(checkedItems);
  }
   else {
    onSelectedAttachmentsChange?.({});
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

  const onSelectionChange = (event: GridSelectionChangeEvent) => {
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedAttachments ?? {},
      dataItemKey: DATA_ITEM_KEY,
    });
    onSelectedAttachmentsChange?.(newSelectedState);
    const selectedAttachmentsCount = Object.values(newSelectedState).filter(value => value === true).length;
    if(selectedAttachmentsCount === attachmentsData.length) {
      setHeaderChecked(true);
    } else {
      setHeaderChecked(false);
    }
  };

  const data = attachmentsData.map((list) => ({ ...list, [SELECTED_FIELD]: Boolean(selectedAttachments?.[idGetter(list)]) }));

  return (
    <>
    <ReorderContext.Provider value={{ reorder, dragStart }}>
            <DragAndDrop>
    <KendoDataGrid
    fullWidth
    sortable
    filterable
    hasBoxScrollbars
    schema={schema}
    data={data}
    rowRender={(row, rowProps) => <DraggableRow elementProps={row.props} {...rowProps} />}
    selectedField={SELECTED_FIELD}
    dataItemKey={DATA_ITEM_KEY}
    selectable={{
      enabled: true,
      drag: true,
      cell: true,
      mode: 'multiple',
    }}
    onSelectionChange={onSelectionChange}
    >
      <GridColumn title="" width="40px" cell={DragHandleCell} />
    </KendoDataGrid>
    </DragAndDrop>
        </ReorderContext.Provider>
    </>
  );
};

export default AttachmentTable;
