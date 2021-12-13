import { get } from "lodash";
import React from "react";
import { ReactComponent as SchemaIcon } from "../../../../assets/images/grid_schema.svg";
import { SchemaForm } from "./schema.form";

export const SchemaCell = (props) => {
  const [openForm, setOpenForm] = React.useState(false);
  const openSchemaWindow = () => {
    setOpenForm(true);
  };
  const handleCancelEdit = () => {
    setOpenForm(false);
  };
  if (props.rowType === "groupHeader") {
    return null;
  }
  const formattedValue = get(props.dataItem, props.field);
  return (
    <>
      <td colSpan={props.colSpan}
        style= {props.style}
        role="gridcell"
        aria-colindex={props.ariaColumnIndex}
        aria-selected="false"
        className={props.className}
        data-grid-col-index={props.columnIndex}><SchemaIcon onClick={() => {
          openSchemaWindow();
        }}/></td>
      {openForm && (
        <SchemaForm
          cancelEdit={handleCancelEdit}
          // onSubmit={handleSubmit}
          item={formattedValue}
        />
      )}
    </>
  );
};
