import React from "react";
import { SMBox, SMTemplateProps } from "../../..";

const SMTemplate: React.FunctionComponent<SMTemplateProps> = ({
  header,
  lhrSteps,
  templateBoxProps,
  headerBoxProps,
  footerBoxProps,
  leftSidebarBoxProps,
  rightSidebarBoxProps,
  contentBoxProps,
  leftSidebar,
  rightSidebar,
  boxProps,
  footer,
  children,
}) => (
  <SMBox display="flex" flexDirection="row" flex={1} {...templateBoxProps}>
    {leftSidebar && (
      <SMBox {...leftSidebarBoxProps}>
        {leftSidebar}
      </SMBox>
    )}
    <SMBox display="flex" flexDirection="column" flex={5} {...boxProps}>
      {header && (
        <SMBox {...headerBoxProps}>
          {header}
        </SMBox>
      )}
      {lhrSteps && (
        <SMBox {...headerBoxProps}>
          {lhrSteps}
        </SMBox>
      )}
      <SMBox display="flex" flex={1} {...contentBoxProps} >
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
