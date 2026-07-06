import { getter } from '@progress/kendo-data-query';
import { DragAndDrop } from '@progress/kendo-react-common';
import { getSelectedState } from '@progress/kendo-react-data-tools';
import { GridSelectionChangeEvent } from '@progress/kendo-react-grid';
import { CheckboxChangeEvent } from '@progress/kendo-react-inputs';
import { isNull } from 'lodash';
import React, { useContext } from 'react';
import { SM } from '../../../../App';
import { AttachmentType } from '../../../../state/ducks/attachments/types';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DocumentRevision, DocumentRevisionStatus } from '../../../../state/ducks/documentRevisions/types';
import { AiWidgetContext } from '../../../app/AiWidget';
import { Attachment } from '../../../change.request/form/types';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import KendoDataGrid from '../../KendoDataGrid/KendoDataGrid';
import { DragContext } from './components/DragCell';
import { DATA_ITEM_KEY, SELECTED_FIELD } from './constants';
import { buildSchema } from './schema';
import { useStyles } from './styles';

const idGetter = getter(DATA_ITEM_KEY);

interface Props {
  attachments: Attachment[]
  documentRevision: DocumentRevision
  onDownloadAttachment?: (attachment: Attachment, type?: AttachmentType) => void
  onDownloadAsPDF?: (attachment: Attachment, attachmentType: AttachmentType) => void
  onView?: (attachment: Attachment) => (evt: React.MouseEvent<HTMLElement>) => void
  onDelete?: (attachment: Attachment) => () => void
  selectedAttachments?: { [id: string]: boolean | number[] }
  onSelectedAttachmentsChange?: (selectedAttachments: { [id: string]: boolean | number[] }) => void
  onHeaderCheck?: (value: boolean) => void
  isHeaderChecked?: boolean
}

const AttachmentTable: React.FC<Props> = ({
  attachments,
  documentRevision,
  selectedAttachments,
  isHeaderChecked = false,
  onDownloadAttachment,
  onDownloadAsPDF,
  onView,
  onDelete,
  onSelectedAttachmentsChange,
  onHeaderCheck,
}) => {
  const classes = useStyles();
  const [attachmentsData, setAttachmentsData] = React.useState(attachments);
  const [activeItem, setActiveItem] = React.useState<Attachment | null>(null);
  const reOrderAttachmentsAction = useActionCreator(documentRevisionsActions.save);
  const { _formState } = SM.useStores();
  const isDisabled = [DocumentRevisionStatus.Released, DocumentRevisionStatus.InReview, DocumentRevisionStatus.Obsolete, DocumentRevisionStatus.Approved, DocumentRevisionStatus.Deprecated].includes(documentRevision?.status);
  const aiWidgetContext = useContext(AiWidgetContext);

  const async = useAsync<DocumentRevision>({
    onSuccess: (values?: DocumentRevision) => {
      setAttachmentsData(values?.attachments ?? []);
    },
  });

  const reorder = (item: Attachment) => {
    const isPrimary = Boolean(documentRevision?.primaryAttachment?.id);
    if (activeItem === item || (isPrimary && activeItem?.index === 0)) {
      return;
    }

    const reorderedData = attachmentsData.slice();
    const prevIndex = reorderedData.findIndex((p) => p.id === activeItem?.id);
    const nextIndex = reorderedData.findIndex((p) => p.id === item.id);

    if (isPrimary && nextIndex === 0) {
      return;
    }

    reorderedData.splice(prevIndex, 1);
    reorderedData.splice(nextIndex, 0, activeItem ?? reorderedData[0]);

    setAttachmentsData(reorderedData);
  };

  // Sets the item being dragged as the active item
  const dragStart = (dataItem: Attachment) => {
    setActiveItem(dataItem);
  };

  const onDrop = () => {
    const reorderedData = attachmentsData.map((item, i) => {
      return { ...item, index: i + 1 };
    });
    if (documentRevision?.id) {
      async.start(
        reOrderAttachmentsAction,
        documentRevision?.id,
        { attachments: reorderedData },
        async,
      );
    } else {
    _formState?.setValue('attachments', reorderedData);
    }
  };

  const handleHeaderCheckedChange = (event: CheckboxChangeEvent) => {
    onHeaderCheck?.(Boolean(event.target.value));
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
    onHeaderCheck?.(selectedAttachmentsCount === attachmentsData.length);
  };

  const schema = buildSchema({
    isHeaderChecked,
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
    const selectedIds = Object.entries(selectedAttachments ?? [])
      .filter(([id, selected]) => selected)
      .map(([id]) => id);
    aiWidgetContext?.updateAttachments(selectedIds);
  }, [selectedAttachments]);

  React.useEffect(() => {
    const sortedAttachments = [...attachments].sort((a, b) => Number(a?.index) - Number(b?.index));
    setAttachmentsData(sortedAttachments);
  }, [attachments]);

  return (
    <DragContext.Provider value={{ reorder: reorder, dragStart: dragStart, onDrop: onDrop, isDisabled }}>
      <DragAndDrop>
        <KendoDataGrid
          className={classes.grid}
          fullWidth
          sortable
          filterable
          hasBoxScrollbars
          resizable
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
    </DragContext.Provider>
  );
};

export default AttachmentTable;
