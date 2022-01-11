import { Box } from "@material-ui/core";
import { GridCellProps } from "@progress/kendo-react-grid";
import React, { ReactElement } from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../kendo/helpers";

const CellRender = (td: ReactElement | null, {
  rowType,
  dataItem,
}: GridCellProps) => {
  const intl = useIntl();
  if (td && td.props.children && rowType === "groupHeader") {
    const formatMessageMap = (text: string | number) =>
      intl.formatMessage({ id: TranslatedText[text] });
    let children = (
      <Box component="span">
        {td.props.children.props?.children}
        {typeof dataItem.value === "boolean"
          ? dataItem.value
            ? formatMessageMap(DisplayText.YES)
            : formatMessageMap(DisplayText.NO)
          : null}
      </Box>
    );
    if (dataItem.field === "active") {
      children = (
        <Box component="span">
          {td.props.children.props?.children}{" "}
          {dataItem.value
            ? formatMessageMap(DisplayText.ACTIVE)
            : formatMessageMap(DisplayText.INACTIVE)}
        </Box>
      );
    }
    if (dataItem.field === "status") {
      children = (
        <Box component="span">
          {td.props.children?.props?.children}{" "}
          {dataItem.value
            ? formatMessageMap(DisplayText.SIGNEDUP)
            : formatMessageMap(DisplayText.RESEND_SIGNUP_EMAIL)}
        </Box>
      );
    }
    if (dataItem.field === "isOfficial") {
      children = (
        <Box component="span">
          {td.props.children?.props?.children}{" "}
          {dataItem.value
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
