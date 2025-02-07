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
import { isNull } from 'lodash';

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
  attachments: Attachment[]
  documentRevision: DocumentRevision
  onDownloadAttachment?: (attachment: Attachment, type?: AttachmentType) => any
  onDownloadAsPDF?: (attachment: Attachment, attachmentType: AttachmentType) => void
  onView?: (attachment: Attachment) => any
  onDelete?: (attachment: Attachment) => () => any
  selectedAttachments?: { [id: string]: boolean | number[] }
  onSelectedAttachmentsChange?: (selectedAttachments: { [id: string]: boolean | number[] }) => void
  onHeaderChecked?: (value: boolean) => void
  headerChecked?: boolean
}

const AttachmentTable: React.FC<Props> = ({
  attachments,
  documentRevision,
  selectedAttachments,
  headerChecked = false,
  onDownloadAttachment,
  onDownloadAsPDF,
  onView,
  onDelete,
  onSelectedAttachmentsChange,
  onHeaderChecked,
}) => {
  const [attachmentsData, setAttachmentsData] = React.useState(attachments ?? []);
  const [activeItem, setActiveItem] = React.useState<any | null>(null);
  const [showAll, setShowAll] = React.useState(false);

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
    onHeaderChecked?.(Boolean(event.target.value));
    if (event.target.value) {
      const checkedItems = {} as { [id: string]: boolean | number[] };
      attachmentsData.forEach(element => {
        if (!selectedAttachments?.[idGetter(element)]) {
          checkedItems[element.id] = true;
        }
      });
      onSelectedAttachmentsChange?.(checkedItems);
    }
    else {
      onSelectedAttachmentsChange?.({});
    }
  };

  const onSelectionChange = (event: GridSelectionChangeEvent) => {
    const { dataItem } = event;
    if(isNull(dataItem)) {
      return;
    }
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedAttachments ?? {},
      dataItemKey: DATA_ITEM_KEY,
    });
    onSelectedAttachmentsChange?.(newSelectedState);
    const selectedAttachmentsCount = Object.values(newSelectedState).filter(value => value === true).length;
    onHeaderChecked?.(selectedAttachmentsCount === attachmentsData.length);
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
    setAttachmentsData(attachments);
  }, [attachments]);

  const rowRender = (tr, props) => {
    const index = props.dataIndex;
    if (index === 5 && !showAll) {
      return React.cloneElement(tr, {
        children: (
          <td colSpan={6} style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleViewAllClick}>
            {showAll ? 'View Less' : 'View All'}
          </td>
        ),
      });
    }

    // Hide rows after the 5th one (index 5 and above)
    if (index >= 5 && !showAll) {
      return React.cloneElement(tr, { style: { display: 'none' } });
    }

    return tr;
  };

  const handleViewAllClick = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <MyContext.Provider value={{ reorder: reorder, dragStart: dragStart }}>
      <DragAndDrop>
        <KendoDataGrid
          fullWidth
          sortable
          filterable
          hasBoxScrollbars
          resizable
          rowRender={rowRender}
          schema={schema}
          data={attachmentsData ?? []}
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
