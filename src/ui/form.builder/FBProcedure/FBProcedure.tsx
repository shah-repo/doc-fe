import { Box, IconButton } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBInput, FBProcedureItem, FBProcedureProps, FBTextEditor } from "..";
import Colors from "../../layout/theme/utils/colors";
import { FBLabel } from "../FBLabel";
import { FBProvider } from "../FBProvider";
import { withFBProcedure } from "./FBProcedure.wrap";

const FBProcedure: React.FunctionComponent<FBProcedureProps> = ({
  handleAdd,
  removeStep,
  procedureState,
  isPreview,
  isOutput,
  stepIndex,
  disabled,
  name,
  ...props
}) => (
  <FBInput {...props } {...{ name }} type="procedure">
    {!isOutput && (
      <FBLabel
        label={{
          locale: "form.builder.step.number",
          values: { number: stepIndex },
        }}
      />
    )}
    {isOutput && (
      <FBProvider {...{ procedureState }}>
        {!isPreview && (
          <Box display="flex" flexDirection="row-reverse" mb={-2.5} zIndex={100}>
            <Box
              color={Colors.error_red}
              bgcolor={Colors.light_red}
              borderRadius={4}
              marginLeft={1}
            >
              <IconButton
                color="inherit"
                size="small"
                onClick={removeStep}
                {...{ disabled }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
            <FBButton
              label="form.builder.clone.step"
              style={{ textTransform: "none", margin: 0 }}
              size="small"
              onClick={() => handleAdd?.(true)}
              {...{ disabled }}
            />
            <FBButton
              label="form.builder.add.step"
              style={{ textTransform: "none", margin: 0, marginRight: 4 }}
              size="small"
              onClick={() => handleAdd?.()}
              {...{ disabled }}
            />
          </Box>
        )}
        <FBTextEditor
          {...{ disabled }}
          name={`${name}.description`}
          gutter={false}
          label={{
            locale: "form.builder.step.number",
            values: { number: stepIndex },
          }}
        />
        <Box
          display="flex"
          border={isPreview ? 0 : 1}
          borderBottom={0}
          borderRight={0}
          borderTop={0}
          borderColor={Colors.hint_gray}
          mt={1}
          ml={isPreview ? 0 : 1.5}
        >
          {!isPreview && (
            <Box width={10} mr={1}>
              <Box display="flex" height="100%" flexDirection="column">
                <Box
                  flexGrow={1}
                  border={1}
                  borderLeft={0}
                  borderRight={0}
                  borderTop={0}
                  borderColor={Colors.hint_gray}
                  mt={5}
                />
                <Box
                  border={1}
                  borderLeft={0}
                  borderRight={0}
                  borderTop={0}
                  borderColor={Colors.hint_gray}
                  height={1}
                />
              </Box>
            </Box>
          )}
          <Box flexGrow={1} bgcolor="white" mb={6.5} mt={2}>
            <FBProcedureItem type="materials" {...{ name, disabled, isPreview }} />
          </Box>
        </Box>
        <Box bgcolor="white" ml={isPreview ? 0 : 4} mt={-3.5}>
          <FBProcedureItem type="equipment" {...{ name, disabled, isPreview }} />
        </Box>
      </FBProvider>
    )}
  </FBInput>
);

export default withFBProcedure(FBProcedure);
