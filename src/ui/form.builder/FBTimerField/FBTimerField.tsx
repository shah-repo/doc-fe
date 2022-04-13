import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBTextField, FBTimerProps } from "..";
import { FBButtonStyles } from "../styles/FBButton.styles";

const FBTimerField: React.FunctionComponent<FBTimerProps> = ({
  ...props
}) => {
  const classes = FBButtonStyles();
  return (
    <Box display="flex" >
      <Box flexGrow={0.99}>
        <FBTextField {...props}/>
      </Box>
      <Box mt={2}>
        <FBButton
          label="form.builder.start.timer"
          dataCy="form.builder.start.timer"
          size="medium"
          variant="text"
          fullWidth={true}
          className={classes.button}
          disabled={props.disabled}
        />
      </Box>
    </Box>
  );
};

export default FBTimerField;
