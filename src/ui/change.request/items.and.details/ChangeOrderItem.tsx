/* eslint-disable no-console */
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { FBFormState } from "../../form.builder";
import ChangeOrderEditGridItem from "./ChangeOrderEditGridItem";
import ChangeOrderViewGridItem from "./ChangeOrderViewGridItem";
import ItemsAndDetailsState from "./ItemsAndDetails.state";
import { ChangeOrderGridItem } from "./ItemsAndDetails.types";

const ChangeOrderItem: React.FunctionComponent<{
  entry: ChangeOrderGridItem;
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
          <ChangeOrderEditGridItem {...{ formState }}
            disabledOptions={disabledOptions()}
            addRevisionToChangeRequest={addRevisionToChangeRequest}
            resetAndCancelEdit={resetAndCancelEdit}
            showAutoComplete={false}
            titleText={entry.titleText}
          />
      }
      { !editMode &&
        <ChangeOrderViewGridItem
          entry={entry}
          editItem={editItem}
          handleRemove={handleRemove}
          viewItemActionsVisible={viewItemActionsVisible}
        /> }
    </>
  ));
};

export default ChangeOrderItem;
