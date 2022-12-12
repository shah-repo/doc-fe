/* eslint-disable no-console */
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import { FBFormState } from "../../form.builder";
import ChangeOrderEditGridItem from "./ChangeOrderEditGridItem";
import ChangeOrderViewGridItem from "./ChangeOrderViewGridItem";
import { useItemsAndDetailsStore } from "./ItemsAndDetails.state";
import { ChangeOrderGridItem } from "./ItemsAndDetails.types";

const ChangeOrderItem: React.FunctionComponent<{
  entry: ChangeOrderGridItem;
  formState: FBFormState;
  disabledOptions: () => string[];
  handleRemove: (docRevId: string) => void;
  handleUpdate: () => void;
  viewItemActionsVisible: boolean;
}> = ({
  entry,
  formState,
  disabledOptions,
  handleRemove,
  handleUpdate,
  viewItemActionsVisible,
}) => {

  const [editMode, setEditMode] = useState(false);
  const { itemsAndDetailsStore } = useItemsAndDetailsStore();

  function resetAndCancelEdit() {
    setEditMode(false);
    itemsAndDetailsStore.setViewItemActionsVisibility(true);
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
    itemsAndDetailsStore.setViewItemActionsVisibility(false);
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
