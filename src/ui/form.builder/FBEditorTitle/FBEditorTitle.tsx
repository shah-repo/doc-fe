import { Box, IconButton, Typography } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
import { useIntl } from "react-intl";
import {
  FBEditorModeProps,
  FBEditorTitleProps,
  FBEditorTitleState,
  FBMapWrapper,
} from "..";
import Text from "../../../../src/ui/components/Text";
import { ReactComponent as CaretIcon } from "../../../assets/images/leftPanel/caret.svg";
import styles from "./FBEditorTitle.styles";
import { withFBEditorTitle } from "./FBEditorTitle.wrap";

interface FBEditorTitlePropsIncludesType extends FBEditorTitleProps {
  type?: string;
  onFBEditorClose?: () => void;
  underValidation?: boolean;
}

const FBEditorTitle: React.FunctionComponent<FBEditorTitlePropsIncludesType> = ({
  handleMode,
  mode,
  type,
  onFBEditorClose,
  underValidation,
}) => {
  const intl = useIntl();
  const classes = styles();
  const formattedTitle = intl.formatMessage({
    id: `form.builder.${type}`,
  }) || "";
  return (
    <>
      {!underValidation &&  <Box
        pl={1}
        display="flex"
        height={45}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography className={classes.staticTitleText}>
          <Text translation="form.builder.create.field" />
        </Typography>
      </Box>
      }

      {underValidation &&  <Box className={classes.rootContainer}>
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
                <Text translation={config.label} />
              </ToggleButton>
            )}
          </FBMapWrapper>
        </ToggleButtonGroup>
      </Box>}
      <Box onClick={onFBEditorClose} className={classes.titleContainerText}>
        <IconButton disableFocusRipple={true} disableRipple={true}>
          <CaretIcon />
        </IconButton>
        <Typography className={classes.titleText}>{formattedTitle}</Typography>
      </Box>
    </>
  );
};

export default withFBEditorTitle(FBEditorTitle);
