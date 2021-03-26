import { Box } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBButton, FBInput, FBMapWrapper, FBMPIProcedureItem, FBMPIProcedureProps, FBProcedureItemType, FBProvider, FBTextEditor } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBMPIProcedure } from "./FBMPIProcedure.wrap";

const FBMPIProcedure: React.FunctionComponent<FBMPIProcedureProps> = ({
  handleAdd,
  mpiProcedureState,
  isPreview,
  isOutput = true,
  stepIndex,
  disabled,
  types = [],
  name,
  redlineActive,
  ...props
}) => (
  <FBInput {...props } {...{ name }} type="mpiprocedure">
    <Box
      pb={3}
      mt={-2.7}
      color={Colors.hint_gray}
      borderBottom={2}
    >
      <FBProvider {...{ mpiProcedureState }}>
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
          boxProps={{ style: { color: Colors.black } }}
          withState
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
          <FBMapWrapper<string[]> collection={types}>
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
                  <FBMPIProcedureItem {...{ type, name, disabled, isPreview, isOutput, redlineActive }} />
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
            <FBMPIProcedureItem
              type={types.pop() as FBProcedureItemType}
              {...{ name, disabled, isPreview, isOutput, redlineActive }} />
          </Box>
        </Box>
      </FBProvider>
    </Box>
  </FBInput>
);

export default withFBMPIProcedure(FBMPIProcedure);
