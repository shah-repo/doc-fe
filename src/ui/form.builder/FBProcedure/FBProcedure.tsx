import { Box } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBInput, FBLabel, FBMapWrapper, FBProcedureItem, FBProcedureItemType, FBProcedureProps, FBProvider, FBTextEditor } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBProcedure } from "./FBProcedure.wrap";

const FBProcedure: React.FunctionComponent<FBProcedureProps> = ({
  handleAdd,
  procedureState,
  isPreview,
  isOutput,
  stepIndex,
  disabled,
  types = [],
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
    <Box
      pb={3}
      color={Colors.hint_gray}
      borderBottom={2}
    >
      {isOutput && (
        <FBProvider {...{ procedureState }}>
          {!isPreview && (
            <Box display="flex" flexDirection="row-reverse" mb={1} mt={2.5}>
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
            autosave
            boxProps={{ style: { color: Colors.black } }}
          />
          <Box
            display="flex"
            flexDirection="column"
            borderColor={Colors.hint_gray}
            ml={isPreview ? 0 : 1.5}
            mt={1}
            border={isPreview ? 0 : 1}
            borderTop={0}
            borderRight={0}
            borderBottom={0}
            pb={7.5}
          >
            <FBMapWrapper<string[]> collection={types.slice(0, -1)}>
              {(type, index) => (
                <Box
                  key={`fb-procedure-item-${type}-${index}`}
                  display="flex"
                  flexDirection="row"
                  mt={5}
                >
                  {!isPreview && (
                    <Box
                      width={10}
                      mr={1}
                      mt={2.7}
                      border={0.5}
                      borderColor={Colors.hint_gray}
                      borderBottom={0}
                      borderLeft={0}
                      borderRight={0}
                    />
                  )}
                  <Box flexGrow={1}>
                    <FBProcedureItem {...{ type, name, disabled, isPreview }} />
                  </Box>
                </Box>
              )}
            </FBMapWrapper>
          </Box>
          <Box display="flex" flexDirection="row" mt={-2.7} ml={isPreview ? 0 : 1.5}>
            {!isPreview && (
              <Box
                width={10}
                mr={1}
                mt={2.7}
                border={0.5}
                borderColor={Colors.hint_gray}
                borderBottom={0}
                borderLeft={0}
                borderRight={0}
              />
            )}
            <Box flexGrow={1}>
              <FBProcedureItem type={types.pop() as FBProcedureItemType} {...{ name, disabled, isPreview }} />
            </Box>
          </Box>
        </FBProvider>
      )}
    </Box>
  </FBInput>
);

export default withFBProcedure(FBProcedure);
