import { Box } from "@material-ui/core";
import React from "react";
import { FBCheckbox, FBEditor, FBEditorPlaceholder, FBEditorTextFieldWithRangeProps, FBPassPercentage, FBRange, FBSelect, FBTextField } from "..";
import { withFBEditorTextFieldWithRange } from "./FBEditorTextFieldWithRange.wrap";

const FBEditorTextFieldWithRange: React.FunctionComponent<FBEditorTextFieldWithRangeProps> = ({
  formState,
  aqlOptions,
  children,
  inputProps: { type } = {},
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps, formState }}>
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
        name="rangeOption"
        withState
        gutter={false}
        omitFormValue
      />
      <FBRange
        name="editorConfig.range"
        validationMode="visibility"
        rules="required_if:rangeOption,true"
      />
      <FBCheckbox
        label="form.builder.critical.to.quality"
        name="editorConfig.criticalToQuality"
        gutter={false}
      />
      <FBCheckbox
        label="form.builder.inspection"
        name="editorConfig.inspection"
        gutter={false}
      />
      <FBCheckbox
        label="form.builder.pass.value"
        name="passValue"
        gutter={false}
        validationMode="visibility"
        rules="required_if:editorConfig.inspection,true"
        omitFinalValidation
        showErrorMsg={false}
        omitFormValue
        withState
      />
      <Box display="flex">
        <FBRange
          name="editorConfig.pass.value"
          boxProps={{ flexGrow: 1 }}
          validationMode="visibility"
          rules="required_if:editorConfig.pass.type,value"
          omitFinalValidation
          showErrorMsg={false}
          withState
          gutter={false}
        />
        <FBPassPercentage
          name="editorConfig.pass.percentage"
          validationMode="visibility"
          rules="required_if:editorConfig.pass.type,percentage"
          omitFinalValidation
          showErrorMsg={false}
          gutter={false}
          withState
        />
        <FBSelect
          name="editorConfig.pass.type"
          boxProps={{ minWidth: "27%", ml: 2 }}
          validationMode="visibility"
          rules="required_if:passValue,true"
          omitFinalValidation
          showErrorMsg={false}
          withState
          gutter={false}
          options={[
            {
              text: "Percentage",
              value: "percentage",
            },
            {
              text: "Value",
              value: "value",
            },
          ]}
        />
      </Box>
      <FBSelect
        boxProps={{ mt: 5 }}
        label="form.builder.aql"
        name="editorConfig.aql"
        options={aqlOptions}
        validationMode="visibility"
        rules="required_if:editorConfig.inspection,true"
        omitFinalValidation
        showErrorMsg={false}
      />
      <FBCheckbox
        label="form.builder.fai"
        name="editorConfig.fai"
        validationMode="visibility"
        rules="required_if:editorConfig.inspection,true"
        omitFinalValidation
        showErrorMsg={false}
      />
    </Box>
    {children}
  </FBEditor>
);

export default withFBEditorTextFieldWithRange(FBEditorTextFieldWithRange);
