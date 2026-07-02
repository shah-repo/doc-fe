import { useObserver } from 'mobx-react';
import React, { useState } from 'react';
import { FBFormState } from '../../form.builder';
import ApprovalRequestEditGridItem from './ApprovalRequestEditGridItem';
import ApprovalRequestViewGridItem from './ApprovalRequestViewGridItem';
import ItemsAndDetailsState from './ItemsAndDetails.state';
import { ApprovalRequestGridItem } from './ItemsAndDetails.types';

const ApprovalRequestItem: React.FunctionComponent<{
  entry: ApprovalRequestGridItem
  formState: FBFormState
  disabledOptions: () => string[]
  handleRemove: (docRevId: string) => void
  handleUpdate: () => void
  viewItemActionsVisible: boolean
  itemsAndDetailsState: ItemsAndDetailsState
  isLineItemPartCanBeSubstituted?: boolean
  isDeletionDisabled?: boolean
  revision: number
}> = ({
  entry,
  formState,
  disabledOptions,
  handleRemove,
  handleUpdate,
  viewItemActionsVisible,
  itemsAndDetailsState,
  isLineItemPartCanBeSubstituted,
  isDeletionDisabled,
  revision,
}) => {
  const [isEditMode, setEditMode] = useState(false);

  function resetAndCancelEdit () {
    setEditMode(false);
    itemsAndDetailsState.setViewItemActionsVisibility(true);
  }

  function addRevisionToChangeRequest () {
    setEditMode(false);
    handleUpdate();
  }

  function editItem () {
    const values = [
      { key: 'autoUpdate', value: entry.autoUpdate },
      { key: 'proposedDocumentRevision', value: { id: entry.docRevId } },
      { key: 'revisionFormTo', value: entry.revisionFormTo ?? revision },
      { key: 'attachments', value: entry.attachments },
      { key: 'descriptionOfChange', value: entry.descriptionOfChange },
      { key: 'justificationOfChange', value: entry.justificationOfChange },
    ];
    values.forEach((item) => {
      formState.setFieldValue(item.key, item.value);
    });
    setEditMode(true);
    itemsAndDetailsState.setViewItemActionsVisibility(false);
  }

  return useObserver(() => (
    <>
      {isEditMode ? (
        <ApprovalRequestEditGridItem
          {...{ formState }}
          entry={entry}
          addRevisionToChangeRequest={addRevisionToChangeRequest}
          resetAndCancelEdit={resetAndCancelEdit}
          handleRemove={handleRemove}
          isLineItemPartCanBeSubstituted={isLineItemPartCanBeSubstituted}
          isDeletionDisabled={isDeletionDisabled}
        />
      ) : (
        <ApprovalRequestViewGridItem
          entry={entry}
          editItem={editItem}
          handleRemove={handleRemove}
          viewItemActionsVisible={viewItemActionsVisible}
          isLineItemPartCanBeSubstituted={isLineItemPartCanBeSubstituted}
          itemsAndDetailsState={itemsAndDetailsState}
        />
      )}
    </>
  ));
};

export default ApprovalRequestItem;
