import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as FieldConfigIcon } from "../../../../assets/images/grid_field_config.svg";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import { parseJSON } from "../../transform";
import { TextareaDialog } from "./TextareaDialog";


export const FieldsConfig = (props) => {
  const intl = useIntl();
  const [openForm, setOpenForm] = React.useState(false);
  const openPopUpWindow = () => {
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
        value: parseJSON(event.fieldsConfig),
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
        <FieldConfigIcon
          onClick={() => {
            openPopUpWindow();
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
