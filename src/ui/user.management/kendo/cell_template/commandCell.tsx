import * as React from "react";

export const CommandCell = (props) => {
  const { dataItem } = props;
  const inEdit = dataItem[props.editField];

  return inEdit ? (
    <td className="k-command-cell">
      <button
        className="k-button k-grid-save-command"
        onClick={() => props.add(dataItem)}
      >
        Update
      </button>
      <button
        className="k-button k-grid-cancel-command"
        onClick={() => props.cancel(dataItem)}
      >
        Cancel
      </button>
    </td>
  ) : (
    <td className="k-command-cell">
      <button
        className="k-primary k-button k-grid-edit-command"
        onClick={() => props.edit(dataItem)}
      >
        Edit
      </button>
    </td>
  );
};
