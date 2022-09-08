import { Box } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBInput, FBLabel, FBMapWrapper, FBProcedureItem, FBProcedureItemType, FBProcedureProps, FBProvider, FBTextEditor } from "..";
import { StyledTooltip } from "../../../App/Enlil/Features/DocumentRevisionForm/Components/Sidebar/DocumentRevisionSidebar.new";
import { ReactComponent as AddNewIcon } from "../../../assets/images/formBuilder/icon_add.svg";
import { ReactComponent as CloneIcon } from "../../../assets/images/formBuilder/icon_clone.svg";
import Colors from "../../layout/theme/utils/colors";
import { FBFontStyle } from "../styles/FBFont.styles";
import { withFBProcedure } from "./FBProcedure.wrap";

const FBProcedure: React.FunctionComponent<FBProcedureProps> = ({
  onKeyDown,
  handleAdd,
  procedureState,
  workspaceState,
  isPreview,
  isOutput,
  stepIndex,
  disabled,
  types = [],
  name,
  autoFocus,
  autoScrollTo,
  ...props
}) => (
  <FBInput {...props } {...{ name }} type="procedure">
    {!isOutput && (
      <FBLabel
        label={{
          locale: "form.builder.step.number",
          values: { number: stepIndex },
        }}
        labelProps={FBFontStyle.labelProps}
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
            <Box display="flex" flexDirection="row-reverse" mb={-2.5} position="relative" zIndex={1}>
              <StyledTooltip placement="top" title="form.builder.clone.step">
                <CloneIcon
                  data-cy="form.builder.clone.step"
                  onClick={() => handleAdd?.(true)}
                  {...{ disabled }}
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                />
              </StyledTooltip>
              <StyledTooltip placement="top" title="form.builder.add.step">
                <AddNewIcon
                  data-cy="form.builder.add.step"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAdd?.()}
                  {...{ disabled }}
                />
              </StyledTooltip>
            </Box>
          )}
          <FBTextEditor
            {...{ disabled, autoFocus, autoScrollTo, onKeyDown }}
            name={`${name}.description`}
            gutter={false}
            label={{
              locale: "form.builder.step.number",
              values: { number: stepIndex },
            }}
            autosave={false}
            shouldNotAutosaveOnBlur={true}
            withState
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
