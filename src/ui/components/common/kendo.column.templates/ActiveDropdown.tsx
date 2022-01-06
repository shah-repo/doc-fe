import { makeStyles } from "@material-ui/core";
import { DropDownList } from "@progress/kendo-react-dropdowns/dist/npm/DropDownList/DropDownList";
import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../kendo/helpers";
import { GridCellProperties } from "../kendo/types";

export const ActiveDropdown = (props: GridCellProperties) => {
  const intl = useIntl();
  const dropDownData = [
    {
      text: intl.formatMessage({ id: TranslatedText[DisplayText.ACTIVE] }),
      value: true,
    },
    {
      text: intl.formatMessage({ id: TranslatedText[DisplayText.INACTIVE] }),
      value: false,
    },
  ];
  const isEdit = props.dataItem[intl.formatMessage({ id: TranslatedText[DisplayText.INEDIT] })];
  const formattedValue = get(props.dataItem, props.field || "") ? (
    intl.formatMessage({ id: TranslatedText[DisplayText.ACTIVE] })
  ) : (
    intl.formatMessage({ id: TranslatedText[DisplayText.INACTIVE] })
  );
  if (props.rowType === "groupHeader") {
    return null;
  }
  const styles = makeStyles(() => ({
    topButton: {
      display: "flex",
      alignItems: "center",
    },
    dot: {
      height: "6px",
      width: "6px",
      borderRadius: "50%",
    },
    Active: {
      background: "#0DB78D",
    },
    Inactive: {
      background: "#B4B4B4",
    },
    value: {
      margin: "5px",
    },
  }));
  const classes = styles();
  const handleChange = (e) => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
  };

  const { dataItem } = props;
  const field = props.field || "";
  const dataValue = dataItem[field] === null ? "" : dataItem[field];

  return (
    <td colSpan={props.colSpan}
      style= {props.style}
      role="gridcell"
      className={props.className}
      data-grid-col-index={props.columnIndex}>
      {isEdit ? (
        <DropDownList
          onChange={handleChange}
          value={dropDownData.find((c) => c.value === dataValue)}
          data={dropDownData}
          textField="text"
        />
      ) : (
        <div className={classes.topButton}>
          <span className={`${classes.dot} ${classes[formattedValue]}`}></span>
          <p className={classes.value}>{formattedValue}</p>
        </div>
      )}
    </td>
  );
};
