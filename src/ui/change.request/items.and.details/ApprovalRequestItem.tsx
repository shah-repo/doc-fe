import { isEmpty } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useState } from 'react';
import { FBFormState } from '../../form.builder';
import ApprovalRequestEditGridItem from './ApprovalRequestEditGridItem';
import ApprovalRequestViewGridItem from './ApprovalRequestViewGridItem';
import ItemsAndDetailsState from './ItemsAndDetails.state';
import { ApprovalRequestGridItem, FBDocumentRevisionsValue } from './ItemsAndDetails.types';

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
    const { justificationOfChange, descriptionOfChange }
      = formState?.getValues() as FBDocumentRevisionsValue;

    if (isEmpty(justificationOfChange) || isEmpty(descriptionOfChange)) {
      return;
    }

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
      {
        isEditMode && <>nnnnnnnnnnnnnn</>
          && <ApprovalRequestEditGridItem {...{ formState }}
            disabledOptions={disabledOptions()}
            addRevisionToChangeRequest={addRevisionToChangeRequest}
            resetAndCancelEdit={resetAndCancelEdit}
            showAutoComplete={false}
            titleText={entry.titleText}
            handleRemove={handleRemove}
            entry={entry}
            isLineItemPartCanBeSubstituted={isLineItemPartCanBeSubstituted}
            isDeletionDisabled={isDeletionDisabled}
          />
      }
      { !isEditMode
        && <ApprovalRequestViewGridItem
          entry={entry}
          editItem={editItem}
          handleRemove={handleRemove}
          viewItemActionsVisible={viewItemActionsVisible}
          isLineItemPartCanBeSubstituted={isLineItemPartCanBeSubstituted}
        /> }
    </>
  ));
};

export default ApprovalRequestItem;
