import { Box } from "@material-ui/core";
import React from "react";
import { FBEditorTitleProps, FBEditorTitleState } from ".";
import { FBButton, FBEditorModeProps, FBMapWrapper } from "..";
import { withFBEditorTitle } from "./FBEditorTitle.wrap";

const FBEditorTitle: React.FunctionComponent<FBEditorTitleProps> = ({
  handleMode,
  mode,
}) => (
  <Box mx={-1} display="flex" mb={2}>
    <FBMapWrapper<FBEditorModeProps> collection={FBEditorTitleState.modeConfig}>
      {(config, index) => (
        <FBButton
          key={`fb-editor-mode-${config.mode}-${index}`}
          dataCy={`fb-editor-mode-${config.mode}-${index}`}
          style={{
            ...(config.mode === mode) && { backgroundColor: "rgba(0, 102, 255, 0.2)" },
          }}
          variant="outlined"
          fullWidth
          label={config.label}
          color="primary"
          onClick={handleMode}
        />
      )}
    </FBMapWrapper>
  </Box>
);

export default withFBEditorTitle(FBEditorTitle);
