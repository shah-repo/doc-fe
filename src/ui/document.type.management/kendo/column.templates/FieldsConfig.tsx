import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as FieldConfigIcon } from "../../../../assets/images/grid_field_config.svg";
import { DisplayText, TranslatedText } from "../../../components/common/kendo/helpers";
import Tooltip from "../../../components/common/kendo/Tooltip";
import checkIfJSONObject from "../helper";
import { TextareaDialog } from "./TextareaDialog";


export const FieldsConfig = (props) => {
  const intl = useIntl();
  const getTranslatedText = (key: string) => intl.formatMessage({ id: key });
  const title = getTranslatedText(TranslatedText[DisplayText.FIELD_CONFIG]);
  const [openForm, setOpenForm] = React.useState(false);
  const openPopUpWindow = () => {
    setOpenForm(true);
  };
  const handleCancelEdit = () => {
    setOpenForm(false);
  };

  const onAddClick = (event: any) => {
    if (props.onChange) {
      const fieldConfigValue = checkIfJSONObject(event.fieldsConfig, title);
      if (fieldConfigValue && typeof fieldConfigValue === "object") {
        props.onChange({
          dataIndex: 0,
          dataItem: props.dataItem,
          field: props.field,
          value: fieldConfigValue,
        });
        setOpenForm(false);
      }
    }
  };
  const formattedValue = get(props.dataItem, props.field);
  const isEdit =  props.dataItem[getTranslatedText(TranslatedText[DisplayText.INEDIT])];

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
        <Tooltip
          placement="top"
          data={
            isEdit
              ? getTranslatedText("documenttype.edit.config")
              : getTranslatedText("documenttype.view.config")
          }
          childrenElement={
            <FieldConfigIcon
              style={{ cursor: "pointer" }}
              onClick={() => {
                openPopUpWindow();
              }}
            />
          }
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
