import { Observer } from "mobx-react";
import React from "react";
import { SM, SMBox, SMTemplateProps } from "../../..";

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
}) =>
{
  const  { _documentRevisionFormState } = SM.useStores();
  return (
    <Observer>{() =>
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
          <SMBox display="flex"  overflow={!_documentRevisionFormState?.expanded ? "auto" : ""}
            flex={1} {...contentBoxProps} >
            <SMBox width="0px" flex={1}>
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
    }</Observer>
  ); };

export default SMTemplate;
