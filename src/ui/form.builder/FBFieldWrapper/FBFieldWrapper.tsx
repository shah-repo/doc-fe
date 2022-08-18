import { Box } from "@material-ui/core";
import React from "react";
import { FBFieldBottomBar, FBFieldMarkDown, FBFieldTopBar, FBFieldWrapperProps, FBProvider } from "..";
import Colors from "../../layout/theme/utils/colors";
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
    <Box {...{ onMouseOver, onMouseLeave }} className={`fb-field-wrapper-${inputProps?.name}`}
      marginTop={inputProps?.name === "training-details-section" ? `21px ` : "2px"}>
      <FBFieldTopBar
        visibility={toolsVisible}
        mb={topBarMargin}
        {...{ inputProps }}
      />
      <Box
        border={toolsVisible === "visible" ? `2px solid ${Colors.dodger_blue}` : "none"}
        borderRadius={toolsVisible === "visible" ? "4px 0px 4px 4px" : 0}
        p={1.25}
      >
        <Box display="flex" flexDirection="row">
          <Box width="100%">{props.children}</Box>
        </Box>
        {markDownVisible && <FBFieldMarkDown {...{ index }} />}
      </Box>
      <FBFieldBottomBar visibility={toolsVisible} {...{ index }} mt={1.25} />
    </Box>
  </FBProvider>
);

export default withFBFieldWrapper(FBFieldWrapper);
