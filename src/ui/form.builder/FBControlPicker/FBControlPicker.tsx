import { Box } from "@material-ui/core";
import React from "react";
import { FBButton, FBControlPickerDataProps, FBControlPickerProps, FBLabel, FBMapWrapper } from "..";
import { FBInputType } from "../FBInput";
import { withFBControlPicker } from "./FBControlPicker.wrap";

const FBControlPicker: React.FunctionComponent<FBControlPickerProps> = ({
  controlPickerState,
  pickers = [],
  index = 0,
  openEditor,
}) => (
  <Box px={2}>
    <FBMapWrapper<FBControlPickerDataProps> collection={pickers}>
      {(editors, section) => (
        <Box key={`fb-controlpicker-section-${section}`} mb={4}>
          <Box mx={1}>
            <FBLabel label={`form.builder.${section}`} />
          </Box>
          <FBMapWrapper<FBInputType> collection={editors}>
            {(picker, i) => (
              <React.Fragment key={`fb-controlpicker-editor-${picker}-${i}`}>
                {controlPickerState?.picker(picker, index)}
                {!controlPickerState?.picker(picker, index) && (
                  <FBButton
                    label={`form.builder.${picker as string}`}
                    dataCy={`form.builder.${picker as string}`}
                    onClick={openEditor && openEditor({ type: picker, index })}
                  />
                )}
              </React.Fragment>
            )}
          </FBMapWrapper>
        </Box>
      )}
    </FBMapWrapper>
  </Box>
);

export default withFBControlPicker(FBControlPicker);
