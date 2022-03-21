import { Box } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
import {
  FBEditorModeProps,
  FBEditorTitleProps,
  FBEditorTitleState,
  FBMapWrapper,
} from "..";
import Text from "../../../../src/ui/components/Text";
import { Translation } from "../../translations/types";
import styles from "./FBEditorTitle.styles";
import { withFBEditorTitle } from "./FBEditorTitle.wrap";

const FBEditorTitle: React.FunctionComponent<FBEditorTitleProps> = ({
  handleMode,
  mode,
}) => {
  const classes = styles();
  return (
    <Box className={classes.rootContainer}>
      <ToggleButtonGroup
        color="primary"
        exclusive
        className={classes.toggleButtonGroup}
      >
        <FBMapWrapper<FBEditorModeProps>
          collection={FBEditorTitleState.modeConfig}
        >
          {(config, index) => (
            <ToggleButton
              key={`fb-editor-mode-${config.mode}-${index}`}
              data-cy={`fb-editor-mode-${config.mode}-${index}`}
              value={config}
              disableFocusRipple
              disableRipple
              onClick={handleMode}
              className={`${classes.button} ${classes[config.mode]} ${
                mode === config.mode ? classes.active : classes.inactive
              }`}
            >
              <Text translation={config.label as Translation} />
            </ToggleButton>
          )}
        </FBMapWrapper>
      </ToggleButtonGroup>
    </Box>
  );
};

export default withFBEditorTitle(FBEditorTitle);
