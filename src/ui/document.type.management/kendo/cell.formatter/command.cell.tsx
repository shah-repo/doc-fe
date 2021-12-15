import React from "react";

export const CommandCell = (props) => {
  const { dataItem } = props;
  const inEdit = dataItem[props.editField];
  const isNewItem = dataItem.id === undefined;
  return inEdit ? (
    // className="k-command-cell"
    <td  colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}>
      <button
        className="k-button k-grid-save-command"
        onClick={() =>
          isNewItem ? props.add(dataItem) : props.update(dataItem)
        }
      >
        {isNewItem ? "Add" : "Update"}
      </button>
      <button
        className="k-button k-grid-cancel-command"
        onClick={() =>
          isNewItem ? props.discard(dataItem) : props.cancel(dataItem)
        }
      >
        {isNewItem ? "Discard" : "Cancel"}
      </button>
    </td>
  ) : (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      aria-colindex={props.ariaColumnIndex}
      aria-selected="false"
      className={props.className}
      data-grid-col-index={props.columnIndex}>
      <button
        className="k-primary k-button k-grid-edit-command"
        onClick={() => props.edit(dataItem)}
      >
        Edit
      </button>
      <button
        className="k-button k-grid-remove-command"
        onClick={() =>
          props.remove(dataItem)
        }
      >
        Remove
      </button>
    </td>
  );
};
