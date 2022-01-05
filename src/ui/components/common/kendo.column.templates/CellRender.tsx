import { GridCellProps } from "@progress/kendo-react-grid";
import React from "react";
import { useIntl } from "react-intl";
import { DisplayText, TranslatedText } from "../kendo/helpers";

const CellRender = (td: any, props: GridCellProps) => {
  const intl = useIntl();
  if (td && td.props.children && props.rowType === "groupHeader") {
    const formatMessageMap = (text: string | number) => intl.formatMessage({ id: TranslatedText[text] });
    let children;
    if (props.dataItem.field === "active") {
      children = (
        <span>{td.props.children.props?.children} {props.dataItem.value ?
          formatMessageMap(DisplayText.ACTIVE) :
          formatMessageMap(DisplayText.INACTIVE)}</span>
      );
    }
    if (props.dataItem.field === "status") {
      children = (
        <span>{td.props.children?.props?.children} {props.dataItem.value ?
          formatMessageMap(DisplayText.SIGNEDUP) :
          formatMessageMap(DisplayText.RESEND_SIGNUP_EMAIL)}</span>
      );
    }
    if (props.dataItem.field === "isOfficial") {
      children = (
        <span>{td.props.children?.props?.children} {props.dataItem.value ?
          formatMessageMap(DisplayText.OFFICIAL) :
          formatMessageMap(DisplayText.UNOFFICIAL)}</span>
      );
    }
    return React.cloneElement(td, td.props, children);
  }
  return td;
};

export default CellRender;
