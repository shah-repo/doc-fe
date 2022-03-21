import { Box } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
import Text from "../../../../../../../ui/components/Text";
import { FBEditorTitleProps } from "../../../../../../../ui/form.builder/FBEditorTitle/FBEditorTitle.types";
import styles from "./LeftToggleButtons.styles";

const LeftToggleButtons: React.FunctionComponent<FBEditorTitleProps> = ({
  mode,
  handleMode,
}) => {
  const classes = styles();
  return (
    <Box className={classes.rootContainer}>
      <ToggleButtonGroup
        color="primary"
        exclusive
        className={classes.toggleButtonGroup}
      >
        <ToggleButton
          value={mode}
          disableFocusRipple
          disableRipple
          onClick={handleMode}
          className={mode === "config" ? classes.toggleButtonConfig : classes.toggleButton}
        >
          <Text translation= "form.builder.field.config" />
        </ToggleButton>
        <ToggleButton
          value={mode}
          disableFocusRipple
          disableRipple
          onClick={handleMode}
          className={mode === "validation" ? classes.toggleButtonMode : classes.toggleButtonNotMode }
        >
          <Text translation= "form.builder.validation" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default LeftToggleButtons;
