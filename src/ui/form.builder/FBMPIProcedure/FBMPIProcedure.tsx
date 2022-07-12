import { Box } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBInput, FBMapWrapper, FBMPIProcedureItem, FBMPIProcedureProps, FBProcedureItemType, FBProvider, FBTextEditor } from "..";
import { ReactComponent as AddNewIcon } from "../../../assets/images/formBuilder/icon_add.svg";
import { ReactComponent as CloneIcon } from "../../../assets/images/formBuilder/icon_clone.svg";
import Colors from "../../layout/theme/utils/colors";
import { withFBMPIProcedure } from "./FBMPIProcedure.wrap";

const FBMPIProcedure: React.FunctionComponent<FBMPIProcedureProps> = ({
  handleAdd,
  onKeyDown,
  mpiProcedureState,
  isPreview,
  isOutput = true,
  stepIndex,
  disabled,
  types = [],
  name,
  redlineActive,
  autoFocus,
  autoScrollTo,
  ...props
}) => (
  <FBInput {...props } {...{ name }} type="mpiprocedure">
    <Box
      pb={3}
      mt={1.75}
      color={Colors.hint_gray}
      borderBottom={1}
    >
      <FBProvider {...{ mpiProcedureState }}>
        {/* TODO: As per design editor title and button should be in line */}
        {!isPreview && (
          <Box display="flex" flexDirection="row-reverse" mt={3.125}>
            <CloneIcon
              data-cy="form.builder.clone.step"
              onClick={() => handleAdd?.()}
              {...{ disabled }}
              style={{ marginLeft: "5px", cursor: "pointer" }}
            />
            <AddNewIcon
              data-cy="form.builder.add.step"
              style={{ cursor: "pointer" }}
              onClick={() => handleAdd?.(true)}
              {...{ disabled }}
            />
          </Box>
        )}
        <FBTextEditor
          {...{ disabled, autoFocus, autoScrollTo, onKeyDown }}
          name={`${name}.description`}
          gutter={false}
          autosave={false}
          shouldNotAutosaveOnBlur={true}
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
                    width={11.51}
                    mt={2.7}
                    border={1}
                    borderColor={Colors.chinese_silver}
                    borderBottom={0}
                    borderLeft={0}
                    borderRight={0}
                  />
                )}
                <Box flexGrow={1}>
                  <FBMPIProcedureItem
                    defaultValue={props.editorConfig?.attachments}
                    {...{
                      type,
                      name,
                      disabled,
                      isPreview,
                      isOutput,
                      redlineActive,
                    }}
                  />
                </Box>
              </Box>
            )}
          </FBMapWrapper>
        </Box>
        <Box display="flex" flexDirection="row" mt={-2.7} ml={isPreview ? 0 : 1.5}>
          {!isPreview && (
            <Box
              width={10}
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
