import { InputAdornment } from "@material-ui/core";
import React from "react";
import { FBAutocomplete, FBData, FBEditor, FBEditorLHRStepProps, FBTextField } from "..";
import Text from "../../components/Text";
import { withFBEditorLHRStep } from "./FBEditorLHRStep.wrap";

const FBEditorLHRStep: React.FunctionComponent<FBEditorLHRStepProps> = ({
  children,
  includeDefaultValue,
  inputProps: { type, index, stepIndex } = {},
  documentTypeOptions,
  inputProps,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <Text message={`form.builder.${type}`}>
      {(defaultValue: string) => (
        <FBTextField
          label="form.builder.label"
          name="label"
          rules="required"
          {...includeDefaultValue && { defaultValue }}
          {...stepIndex && {
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <FBTextField defaultValue={stepIndex} name="stepIndex" hidden />
                  {`#${stepIndex}`}
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    </Text>
    <FBAutocomplete
      label="common.document.types"
      options={documentTypeOptions}
      optionLabelKey="documentTypeName"
      optionValueKey="id"
      name="editorConfig.filters.documentType"
      key={`fb-editor-${type}-${index}`}
      multiple={true}
    />

    <FBAutocomplete
      label="common.revision.statuses"
      options={FBData.statusOptions}
      optionLabelKey="text"
      optionValueKey="value"
      name="editorConfig.filters.revisionStatus"
      key={`fb-editor-${type}-${index}`}
      multiple={true}
    />
    {children}
  </FBEditor>
);

export default withFBEditorLHRStep(FBEditorLHRStep);

