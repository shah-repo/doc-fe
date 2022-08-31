import { Box } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { FBFieldBottomBar, FBFieldMarkDown, FBFieldTopBar, FBFieldWrapperProps, FBProvider } from "..";
import useStyles from "./FBFieldWrapper.styles";
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
}) => {
  const classes = useStyles();

  return (
    <FBProvider {...{ fieldWrapperState }}>
      <Box
        {...{ onMouseOver, onMouseLeave }}
        className={cx(`fb-field-wrapper-${inputProps?.name}`, classes.root)}
        mt={index === 0 ? 0 : type === "section" || type === "approvals" ? 6 : 3.5}
        mb={type === "section" || type === "subsection" ? -1 : 2}
      >
        <Box className={classes.tools} visibility={toolsVisible}>
          <FBFieldTopBar visibility={toolsVisible} {...{ inputProps }} />
          <FBFieldBottomBar visibility={addToolVisible} {...{ index }} />
        </Box>
        <Box display="flex" flexDirection="row">
          <Box width="100%">{props.children}</Box>
        </Box>
        {markDownVisible && <FBFieldMarkDown {...{ index }} />}
      </Box>
    </FBProvider>
  );
};

export default withFBFieldWrapper(FBFieldWrapper);
