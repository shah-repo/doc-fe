import { Box } from "@material-ui/core";
import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../kendo/helpers";

const CellRender = (td: any, props: GridCellProps) => {
  const intl = useIntl();
  if (td && td.props.children && props.rowType === "groupHeader") {
    const formatMessageMap = (text: string | number) =>
      intl.formatMessage({ id: TranslatedText[text] });
    let children = (
      <Box component="span">
        {td.props.children.props?.children}
        {typeof props.dataItem.value === "boolean"
          ? props.dataItem.value
            ? formatMessageMap(DisplayText.YES)
            : formatMessageMap(DisplayText.NO)
          : null}
      </Box>
    );
    if (props.dataItem.field === "active") {
      children = (
        <Box component="span">
          {td.props.children.props?.children}{" "}
          {props.dataItem.value
            ? formatMessageMap(DisplayText.ACTIVE)
            : formatMessageMap(DisplayText.INACTIVE)}
        </Box>
      );
    }
    if (props.dataItem.field === "status") {
      children = (
        <Box component="span">
          {td.props.children?.props?.children}{" "}
          {props.dataItem.value
            ? formatMessageMap(DisplayText.SIGNEDUP)
            : formatMessageMap(DisplayText.RESEND_SIGNUP_EMAIL)}
        </Box>
      );
    }
    if (props.dataItem.field === "isOfficial") {
      children = (
        <Box component="span">
          {td.props.children?.props?.children}{" "}
          {props.dataItem.value
            ? formatMessageMap(DisplayText.OFFICIAL)
            : formatMessageMap(DisplayText.UNOFFICIAL)}
        </Box>
      );
    }
    return React.cloneElement(td, td.props, children);
  }
  return td;
};

export default CellRender;
