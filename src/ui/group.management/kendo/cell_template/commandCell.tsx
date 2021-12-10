import * as React from "react";
import Text from "../../../components/Text";

export const CommandCell = (props) => {
  const { dataItem } = props;
  const inEdit = dataItem.inEdit;

  return inEdit ? (
    <td className="k-command-cell">
      <button
        className="k-primary k-button k-grid-edit-command"
        onClick={() => props.update(dataItem)}
        // onClick={() => (isNewItem ? props.add(dataItem) : props.update(dataItem))}
      >
        <Text translation="common.update" />
      </button>
      <button
        className="k-button k-grid-remove-command"
        onClick={() => props.cancel(dataItem)}
      >
        <Text translation="common.cancel" />
      </button>
    </td>
  ) : (
    <td className="k-command-cell">
      <button
        className="k-primary k-button k-grid-edit-command"
        onClick={() => props.edit(dataItem)}
      >
        <Text translation="common.edit" />
      </button>
      {/* <button
        className="k-button k-grid-remove-command"
        onClick={() => props.discard(dataItem)}
      >
        <Text translation="common.discard" />
      </button> */}
    </td>
  );
};
