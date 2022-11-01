import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBTextField, FBTimerProps } from "..";
import { FBButtonStyles } from "../styles/FBButton.styles";

const FBTimerField: React.FunctionComponent<FBTimerProps> = ({
  ...props
}) => {
  const classes = FBButtonStyles();
  return (
    <Box display="flex" alignItems="flex-end">
      <Box flexGrow={1}>
        <FBTextField {...props} />
      </Box>
      <Box mt={1} ml={1}>
        <FBButton
          label="form.builder.start.timer"
          dataCy="form.builder.start.timer"
          size="large"
          variant="text"
          fullWidth={true}
          className={`${classes.button} ${classes.margin}`}
          disabled={props.disabled}
        />
      </Box>
    </Box>
  );
};

export default FBTimerField;
