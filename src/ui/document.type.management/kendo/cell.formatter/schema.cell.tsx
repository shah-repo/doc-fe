import { get } from "lodash";
import React from "react";
import { ReactComponent as SchemaIcon } from "../../../../assets/images/grid_schema.svg";
import { parseJSON } from "../../transform";
import { GridTextAreaPopUp } from "./grid.textarea.pop.up";


export const SchemaCell = (props) => {
  const [openForm, setOpenForm] = React.useState(false);
  const openSchemaWindow = () => {
    setOpenForm(true);
  };
  const handleCancelEdit = () => {
    setOpenForm(false);
  };

  const onAddClick = (event) => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        // syntheticEvent: event.syntheticEvent,
        value: parseJSON(event.schema),
      });
      setOpenForm(false);
    }
  };

  if (props.rowType === "groupHeader") {
    return null;
  }
  const formattedValue = get(props.dataItem, props.field);
  const isEdit = get(props.dataItem, "inEdit");
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
        }}
        /></td>
      {openForm && (
        <GridTextAreaPopUp
          title={"Schema"}
          cancelEdit={handleCancelEdit}
          addClick={onAddClick}
          // onSubmit={handleSubmit}
          item={formattedValue}
          isEdit= {isEdit}
          fieldName={props.field}
          openForm={openForm}
        />
      )}
    </>
  );
};
