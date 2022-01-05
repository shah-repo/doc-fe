import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as SchemaIcon } from "../../../../assets/images/grid_schema.svg";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import { parseJSON } from "../../transform";
import { TextareaDialog } from "./TextareaDialog";


export const Schema = (props) => {
  const intl = useIntl();
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

  const formattedValue = get(props.dataItem, props.field);
  const isEdit = get(
    props.dataItem,
    intl.formatMessage({ id: TranslatedText[DisplayText.INEDIT] })
  );
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
          title={intl.formatMessage({
            id: TranslatedText[DisplayText.FIELD_CONFIG],
          })}
          cancelEdit={handleCancelEdit}
          addClick={onAddClick}
          // onSubmit={handleSubmit}
          item={formattedValue}
          isEdit={isEdit}
          fieldName={props.field}
          openForm={openForm}
        />
      )}
    </>
  );
};
