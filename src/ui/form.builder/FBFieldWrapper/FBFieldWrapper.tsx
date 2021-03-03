import { Box } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import React from "react";
import { FBFieldBottomBar, FBFieldMarkDown, FBFieldTopBar, FBFieldWrapperProps, FBProvider } from "..";
import { withFBFieldWrapper } from "./FBFieldWrapper.wrap";

const FBFieldWrapper: React.FunctionComponent<FBFieldWrapperProps> = ({
  fieldWrapperState,
  inputProps: { index, designDisabled } = {},
  toolsVisible = false,
  markDownVisible = false,
  onMouseOver,
  onMouseLeave,
  topBarMargin,
  grabMargin,
  addToolVisible,
  inputProps,
  ...props
}) => (
  <FBProvider {...{ fieldWrapperState }}>
    <Box {...{ onMouseOver, onMouseLeave }}>
      <FBFieldTopBar visibility={toolsVisible} mb={topBarMargin} {...{ inputProps }} />
      <Box display="flex" flexDirection="row">
        <Box width="100%">{props.children}</Box>
        {!designDisabled && (
          <Box
            display="flex"
            width="0"
            alignItems="center"
            style={{ cursor: "grab" }}
            mt={grabMargin}
          >
            <DragIndicatorIcon />
          </Box>
        )}
      </Box>
      {markDownVisible && <FBFieldMarkDown {...{ index }} />}
      <FBFieldBottomBar visibility={toolsVisible} {...{ index }} />
    </Box>
  </FBProvider>
);

export default withFBFieldWrapper(FBFieldWrapper);
