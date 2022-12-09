import React, { useState } from "react";
import { FBFormState } from "../../form.builder";
import ChangeOrderEditGridItem from "./ChangeOrderEditGridItem";
import ChangeOrderViewGridItem from "./ChangeOrderViewGridItem";
import { ChangeOrderGridItem } from "./ItemsAndDetails.types";

const ChangeOrderItem: React.FunctionComponent<{
  entry: ChangeOrderGridItem;
  formState: FBFormState;
  disabledOptions: () => string[];
  handleRemove: (docRevId: string) => void;
  handleUpdate: () => void;
}> = ({
  entry,
  formState,
  disabledOptions,
  handleRemove,
  handleUpdate,
}) => {

  const [editMode, setEditMode] = useState(false);

  function resetAndCancelEdit() {
    setEditMode(false);
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
  }

  return (
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
        /> }
    </>
  );
};

export default ChangeOrderItem;
