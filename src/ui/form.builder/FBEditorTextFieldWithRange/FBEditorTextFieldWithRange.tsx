import { Box } from "@material-ui/core";
import React from "react";
import { FBCheckbox, FBData, FBEditor, FBEditorPlaceholder, FBEditorTextFieldWithRangeProps, FBPassPercentage, FBRange, FBSelect, FBTextField } from "..";
import { withFBEditorTextFieldWithRange } from "./FBEditorTextFieldWithRange.wrap";

const FBEditorTextFieldWithRange: React.FunctionComponent<FBEditorTextFieldWithRangeProps> = ({
  formState,
  children,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps, formState, type }}>
    <FBTextField
      key="label"
      dataCy={`fb-editor-field-${type}`}
      label="form.builder.label"
      name="label"
      rules="required"
    />
    <FBEditorPlaceholder key={`fb-editor-placeholder-${type}`} />
    <Box mb={5}>
      <FBCheckbox
        label="form.builder.range"
        name="editorConfig.rangeOption"
        withState
        gutter={false}
      />
      <FBRange name="editorConfig.range" />
      <FBCheckbox
        label="form.builder.critical.to.quality"
        name="editorConfig.criticalToQuality"
        gutter={false}
      />
      <FBCheckbox
        label="form.builder.inspection"
        name="editorConfig.inspection"
        gutter={false}
        withState
      />
      <FBCheckbox
        label="form.builder.pass.value"
        name="editorConfig.passValue"
        gutter={false}
        withState
      />
      <Box display="flex">
        <FBRange
          name="editorConfig.pass.value"
          boxProps={{ flexGrow: 1 }}
          gutter={false}
        />
        <FBPassPercentage
          name="editorConfig.pass.percentage"
          gutter={false}
        />
        <FBSelect
          name="editorConfig.pass.type"
          boxProps={{ minWidth: "27%", ml: 2 }}
          options={FBData.passTypeOptions}
          gutter={false}
          withState
        />
      </Box>
      <FBSelect
        boxProps={{ mt: 5 }}
        label="form.builder.aql"
        name="editorConfig.aql"
        options={FBData.aqlOptions}
      />
    </Box>
    {children}
  </FBEditor>
);

export default withFBEditorTextFieldWithRange(FBEditorTextFieldWithRange);
