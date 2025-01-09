// import cx from 'classnames';
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

const SELECTED_FIELD = 'selected';
const DATA_ITEM_KEY = 'id';
const idGetter = getter(DATA_ITEM_KEY);

interface Props {
  documentRevision: DocumentRevision
  onDownloadAttachment?: (attachment: Attachment, type?: AttachmentType) => any
  onDownloadAsPDF?: (attachment: Attachment, attachmentType: AttachmentType) => void
  onView?: (attachment: Attachment) => any
  onDelete?: (attachment: Attachment) => () => any
}

const AttachmentTable: React.FC<Props> = ({
  documentRevision,
  onDownloadAttachment,
  onDownloadAsPDF,
  onView,
  onDelete,
}) => {
  // const attachmentsData = documentRevision.attachments;
  const [attachmentsData, setAttachmentsData] = React.useState(documentRevision.attachments);
  const [selectedState, setSelectedState] = React.useState<{
    [id: string]: boolean | number[]
  }>({});
  const [headerChecked, setHeaderChecked] = React.useState(false);
//   const onDelete = (attachment: Attachment) => () => {
// console.log('-----onDelete---', { attachment });
// // onDelete?.(attachment);
//   };

const handleHeaderCheckedChange = (event: CheckboxChangeEvent) => {
  setHeaderChecked(Boolean(event.target.value));
  if(event.target.value) {
    const checkedItems = {} as {[id: string]: boolean | number[]};
    attachmentsData.forEach(element => {
      if(!selectedState[idGetter(element)]) {
        checkedItems[element.id] = true;
        // checkedItems.push(element.id);
      }
    });
    // setSelectedState((prevVal) => ({...prevVal, [element.id]: true }));
    setSelectedState((prevVal) => ({ ...prevVal, ...checkedItems }));
  }
   else {
    setSelectedState({});
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
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY,
    });
    console.log('---newSelectedState---', { newSelectedState });
    setSelectedState(newSelectedState);
  };

  const onHeaderSelectionChange = React.useCallback(event => {
    const checkboxElement = event.syntheticEvent.target;
    const checked = checkboxElement.checked;
    const newSelectedState = {};
    event.dataItems.forEach(item => {
      newSelectedState[idGetter(item)] = checked;
    });
    setSelectedState(newSelectedState);
  }, []);

  const data = attachmentsData.map((list) => ({ ...list, [SELECTED_FIELD]: Boolean(selectedState[idGetter(list)]) }));
console.log('-----data----', { data, setAttachmentsData });
  return (
    <>
    <div>AttachmentTable</div>
    <KendoDataGrid
    // className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
    fullWidth
    sortable
    filterable
    hasBoxScrollbars
    schema={schema}
    data={data}
    selectedField={SELECTED_FIELD}
    dataItemKey={DATA_ITEM_KEY}
    selectable={{
      enabled: true,
      drag: true,
      cell: false,
      mode: 'multiple',
    }}

    onSelectionChange={onSelectionChange}
    onHeaderSelectionChange={onHeaderSelectionChange}
    // onRowClick={handleRowClick}
    // rowRender={rowRender}
    >
      {/* <GridColumn orderIndex={0} title="Select" field={SELECTED_FIELD} width="40px" headerSelectionValue={attachmentsData.findIndex(item => !selectedState[idGetter(item)]) === -1} /> */}
    </KendoDataGrid>

    </>
  );
};

export default AttachmentTable;
