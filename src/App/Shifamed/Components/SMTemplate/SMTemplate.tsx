import { Box } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { SMTemplateProps } from "../../..";

const SMTemplate: React.FunctionComponent<SMTemplateProps> = ({
  header,
  headerBoxProps,
  leftSidebarBoxProps,
  leftSidebar,
  rightSidebar,
  footer,
  children,
}) => (
  <Box height="100vh" width="100%" overflow="hidden">
    {header && (
      <Observer>
        {() => (
          <Box width="100%" {...headerBoxProps}>
            {header}
          </Box>
        )}
      </Observer>
    )}
    <Box display="flex" flexDirection="row" minHeight="100%" height="100%">
      {leftSidebar && (
        <Box minHeight="100%" {...leftSidebarBoxProps}>
          {leftSidebar}
        </Box>
      )}
      <Box flexGrow={1} minHeight="100%" width="100%">
        {children}
      </Box>
      {rightSidebar && (
        <Box minHeight="100%" zIndex={1002}>
          {rightSidebar}
        </Box>
      )}
    </Box>
    {footer && (
      <Box
        width="100%"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        {footer}
      </Box>
    )}
  </Box>
);

export default SMTemplate;
