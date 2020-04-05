import { Box } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import React from "react";
import { FBFieldWrapperProps } from ".";
import { FBFieldBottomBar, FBFieldMarkDown, FBFieldTopBar, FBProvider } from "..";
import { withFBFieldWrapper } from "./FBFieldWrapper.wrap";

const FBFieldWrapper: React.FunctionComponent<FBFieldWrapperProps> = ({
  toolsVisible = false,
  markDownVisible = false,
  onMouseOver,
  onMouseLeave,
  topBarMargin,
  bottomBarMargin,
  index,
  state,
  ...props
}) => (
  <FBProvider fieldWrapper={state}>
    <Box {...{ onMouseOver, onMouseLeave }}>
      <FBFieldTopBar
        visibility={toolsVisible}
        mb={topBarMargin}
        index={index}
      />
      <Box display="flex" flexDirection="row">
        <Box width="100%">{props.children}</Box>
        <Box
          display="flex"
          width="0"
          alignItems="center"
          style={{ cursor: "grab" }}
        >
          <DragIndicatorIcon />
        </Box>
      </Box>
      {markDownVisible && <FBFieldMarkDown mt={-3.5} {...{ index }} />}
      <FBFieldBottomBar
        visibility={toolsVisible}
        mt={bottomBarMargin}
        {...{ index }}
      />
    </Box>
  </FBProvider>
);

export default withFBFieldWrapper(FBFieldWrapper);
