import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { FBFormState } from "../../form.builder";
import ApprovalRequestEditGridItem from "./ApprovalRequestEditGridItem";
import ApprovalRequestViewGridItem from "./ApprovalRequestViewGridItem";
import ItemsAndDetailsState from "./ItemsAndDetails.state";
import { ApprovalRequestGridItem } from "./ItemsAndDetails.types";

const ApprovalRequestItem: React.FunctionComponent<{
  entry: ApprovalRequestGridItem;
  formState: FBFormState;
  disabledOptions: () => string[];
  handleRemove: (docRevId: string) => void;
  handleUpdate: () => void;
  viewItemActionsVisible: boolean;
  itemsAndDetailsState: ItemsAndDetailsState;
}> = ({
  entry,
  formState,
  disabledOptions,
  handleRemove,
  handleUpdate,
  viewItemActionsVisible,
  itemsAndDetailsState,
}) => {

  const [editMode, setEditMode] = useState(false);

  function resetAndCancelEdit() {
    setEditMode(false);
    itemsAndDetailsState.setViewItemActionsVisibility(true);
  }

  function addRevisionToChangeRequest() {
    setEditMode(false);
    handleUpdate();
  }

  function editItem() {
    const values = [
      { key: "proposedDocumentRevision", value: { id: entry.docRevId } },
      { key: "descriptionOfChange", value: entry.descriptionOfChange },
      { key: "justificationOfChange", value: entry.justificationOfChange },
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
        editMode &&
          <ApprovalRequestEditGridItem {...{ formState }}
            disabledOptions={disabledOptions()}
            addRevisionToChangeRequest={addRevisionToChangeRequest}
            resetAndCancelEdit={resetAndCancelEdit}
            showAutoComplete={false}
            titleText={entry.titleText}
          />
      }
      { !editMode &&
        <ApprovalRequestViewGridItem
          entry={entry}
          editItem={editItem}
          handleRemove={handleRemove}
          viewItemActionsVisible={viewItemActionsVisible}
        /> }
    </>
  ));
};

export default ApprovalRequestItem;
