import { Box } from "@material-ui/core";
import React from "react";
import { FBFieldBottomBar, FBFieldMarkDown, FBFieldTopBar, FBFieldWrapperProps, FBProvider } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBFieldWrapper } from "./FBFieldWrapper.wrap";

const FBFieldWrapper: React.FunctionComponent<FBFieldWrapperProps> = ({
  fieldWrapperState,
  inputProps: { index = 0, type } = {},
  toolsVisible = false,
  markDownVisible = false,
  onMouseOver,
  onMouseLeave,
  grabMargin,
  addToolVisible,
  inputProps,
  ...props
}) => (
  <FBProvider {...{ fieldWrapperState }}>
    <Box
      {...{ onMouseOver, onMouseLeave }}
      className={`fb-field-wrapper-${inputProps?.name}`}
      position="relative"
      mt={index === 0 ? 0 : type === "section" || type === "approvals" ? 6 : 3}
      mb={2}
    >
      <FBFieldTopBar visibility={toolsVisible} {...{ inputProps }} />
      <Box
        style={{
          outline: toolsVisible === "visible" ? `2px solid ${Colors.dodger_blue}` : "none",
          borderRadius: "4px 0 4px 4px",
        }}
      >
        <Box display="flex" flexDirection="row">
          <Box width="100%">{props.children}</Box>
        </Box>
        {markDownVisible && <FBFieldMarkDown {...{ index }} />}
      </Box>
      <FBFieldBottomBar visibility={toolsVisible} {...{ index }} />
    </Box>
  </FBProvider>
);

export default withFBFieldWrapper(FBFieldWrapper);
