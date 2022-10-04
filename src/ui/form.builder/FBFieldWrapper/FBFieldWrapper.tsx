import { Box } from "@material-ui/core";
import cx from "classnames";
import React from "react";
import { FBFieldBottomBar, FBFieldMarkDown, FBFieldTopBar, FBFieldWrapperProps, FBProvider } from "..";
import useStyles from "./FBFieldWrapper.styles";
import { withFBFieldWrapper } from "./FBFieldWrapper.wrap";

const FBFieldWrapper: React.FunctionComponent<FBFieldWrapperProps> = ({
  fieldWrapperState,
  inputProps: { index = 0 } = {},
  toolsVisible = false,
  markDownVisible = false,
  onMouseOver,
  onMouseLeave,
  addToolVisible,
  inputProps,
  isDragged,
  mt,
  mb,
  ...props
}) => {
  const classes = useStyles({ mt, mb, isDragged });

  return (
    <FBProvider {...{ fieldWrapperState }}>
      <Box {...{ onMouseOver, onMouseLeave }} className={cx(`fb-field-wrapper-${inputProps?.name}`, classes.root)}>
        <Box className={classes.tools} visibility={toolsVisible}>
          <FBFieldTopBar visibility={toolsVisible} {...{ inputProps }} />
          <FBFieldBottomBar visibility={addToolVisible} {...{ index }} />
        </Box>
        <Box className={classes.field}>
          {props.children}
        </Box>
        {markDownVisible && <FBFieldMarkDown {...{ index }} />}
      </Box>
    </FBProvider>
  );
};

export default withFBFieldWrapper(FBFieldWrapper);
