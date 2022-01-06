import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as SchemaIcon } from "../../../../assets/images/grid_schema.svg";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import checkIfJSONObject from "../helper";
import { TextareaDialog } from "./TextareaDialog";


export const Schema = (props) => {
  const intl = useIntl();
  const title = intl.formatMessage({
    id: TranslatedText[DisplayText.SCHEMA],
  });
  const [openForm, setOpenForm] = React.useState(false);
  const openSchemaWindow = () => {
    setOpenForm(true);
  };
  const handleCancelEdit = () => {
    setOpenForm(false);
  };


  const onAddClick = (event) => {
    if (props.onChange) {
      const schemaValue = checkIfJSONObject(event.schema, title);
      if (schemaValue && typeof schemaValue === "object") {
        props.onChange({
          dataIndex: 0,
          dataItem: props.dataItem,
          field: props.field,
          value: schemaValue,
        });
        setOpenForm(false);
      }
    }
  };

  const formattedValue = get(props.dataItem, props.field);
  const isEdit = props.dataItem[intl.formatMessage({ id: TranslatedText[DisplayText.INEDIT] })];
  if (props.rowType === "groupHeader") {
    return null;
  }
  return (
    <>
      <td
        colSpan={props.colSpan}
        style={props.style}
        role="gridcell"
        className={props.className}
        data-grid-col-index={props.columnIndex}
      >
        <SchemaIcon
          onClick={() => {
            openSchemaWindow();
          }}
        />
      </td>
      {openForm && (
        <TextareaDialog
          title={title}
          cancelEdit={handleCancelEdit}
          addClick={onAddClick}
          item={formattedValue}
          isEdit={isEdit}
          fieldName={props.field}
          openForm={openForm}
        />
      )}
    </>
  );
};
