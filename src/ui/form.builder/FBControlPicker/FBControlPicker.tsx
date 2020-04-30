import { Box } from "@material-ui/core";
import React from "react";
import { FBControlPickerState } from ".";
import { FBButton, FBControlPickerDataProps, FBControlPickerProps, FBLabel, FBMapWrapper } from "..";
import { withFBEditorHelper } from "../FBEditor/FBEditor.helper";
import { FBInputType } from "../FBInput";

const FBControlPicker: React.FunctionComponent<FBControlPickerProps> = ({
  index,
  openEditor,
}) => (
  <Box px={2}>
    <FBMapWrapper<FBControlPickerDataProps> collection={FBControlPickerState.config}>
      {(editors, section) => (
        <Box key={`fb-controlpicker-section-${section}`} mb={4}>
          <Box mx={1}>
            <FBLabel label={`form.builder.${section}`} />
          </Box>
          <FBMapWrapper<FBInputType> collection={editors}>
            {(editor, i) => (
              <FBButton
                key={`fb-controlpicker-editor-${editor}-${i}`}
                label={`form.builder.${editor as string}`}
                onClick={openEditor && openEditor({ type: editor, index })}
              />
            )}
          </FBMapWrapper>
        </Box>
      )}
    </FBMapWrapper>
  </Box>
);

export default withFBEditorHelper(FBControlPicker);
