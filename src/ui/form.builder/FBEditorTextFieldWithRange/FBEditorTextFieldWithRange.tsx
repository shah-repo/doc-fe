import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocomplete, FBCheckbox, FBEditor, FBEditorPlaceholder, FBEditorProps, FBEditorTextFieldWithRangeProps, FBPassValue, FBRange, FBTextField } from "..";
import { withFBEditorTextFieldWithRange } from "./FBEditorTextFieldWithRange.wrap";

const FBEditorTextFieldWithRange: React.FunctionComponent<FBEditorProps & FBEditorTextFieldWithRangeProps> = ({
  formState,
  isRangeVisible,
  isInspectionVisible,
  isPassValueVisible,
  aqlOptions,
  children,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps, formState }}>
    <FBTextField
      key={`fb-editor-field-${type}`}
      dataCy={`fb-editor-field-${type}`}
      label="form.builder.label"
      name="label"
      rules="required"
    />
    <FBEditorPlaceholder key={`fb-editor-placeholder-${type}`} />
    <FBCheckbox
      label="form.builder.range"
      name="rangeOption"
      withState
      gutter={false}
    />
    <FBRange
      name="range"
      validationMode="visibility"
      rules="required_if:rangeOption,true"
    />
    <FBCheckbox
      label="form.builder.critical.to.quality"
      name="criticalToQuality"
      gutter={false}
    />
    <FBCheckbox
      label="form.builder.inspection"
      name="inspection"
      withState
      gutter={!isInspectionVisible}
    />
    {isInspectionVisible && (
      <Box marginLeft={2}>
        <FBCheckbox
          label="form.builder.pass.value"
          name="passValue"
          withState
          gutter={!isPassValueVisible}
        />
        <Box marginLeft={4}>
          <FBPassValue isVisible={isPassValueVisible} />
        </Box>
        <FBAutocomplete
          label="form.builder.aql"
          name="aql"
          options={aqlOptions}
        />
        <FBCheckbox
          label="form.builder.fai"
          name="fai"
        />
      </Box>
    )}
    {children}
  </FBEditor>
);

export default withFBEditorTextFieldWithRange(FBEditorTextFieldWithRange);
