import React from "react";
import { SMBox, SMTemplateProps } from "../../..";

const SMTemplate: React.FunctionComponent<SMTemplateProps> = ({
  header,
  templateBoxProps,
  headerBoxProps,
  footerBoxProps,
  leftSidebarBoxProps,
  rightSidebarBoxProps,
  contentBoxProps,
  leftSidebar,
  rightSidebar,
  footer,
  children,
}) => (
  <SMBox display={"flex"} flexDirection="row" flex={1} {...templateBoxProps}>
    {leftSidebar && (
      <SMBox flex={1} {...leftSidebarBoxProps}>
        {leftSidebar}
      </SMBox>
    )}
    <SMBox display={"flex"} flexDirection={"column"} flex={5}>
      {header && (
        <SMBox {...headerBoxProps}>
          {header}
        </SMBox>
      )}
      <SMBox display="flex" {...contentBoxProps} >
        <SMBox flex={1}>
          {children}
        </SMBox>
      </SMBox>
      {footer && (
        <SMBox {...footerBoxProps}>
          {footer}
        </SMBox>
      )}
    </SMBox>
    {rightSidebar && (
      <SMBox {...rightSidebarBoxProps} flex={0}>
        {rightSidebar}
      </SMBox>
    )}
  </SMBox>
);

export default SMTemplate;
