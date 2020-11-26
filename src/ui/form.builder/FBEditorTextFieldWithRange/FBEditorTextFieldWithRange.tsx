import React from "react";
import { FBCheckbox, FBEditor, FBEditorPlaceholder, FBEditorProps, FBEditorTextFieldWithRangeProps, FBForm, FBRange, FBTextField } from "..";
import { withFBEditorTextFieldWithRange } from "./FBEditorTextFieldWithRange.wrap";

const FBEditorTextFieldWithRange: React.FunctionComponent<FBEditorProps & FBEditorTextFieldWithRangeProps> = ({
  isRangeVisible,
  isInspectionVisible,
  children,
  inputProps: { type } = {},
  inputProps,
  formState,
  ...props
}) => (
  <FBEditor {...props} {...{ inputProps }}>
    <FBForm {...{ formState }}>
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
        name="range"
        withState
        gutter={false}
      />
      <FBRange isVisible={isRangeVisible} />
      <FBCheckbox
        label="form.builder.critical.to.quality"
        name="criticalToQuality"
      />
      <FBCheckbox
        label="form.builder.inspection"
        name="inspection"
        withState
        gutter={false}
      />
      {isInspectionVisible && (
        <>
          <FBCheckbox
            label="form.builder.pass.value"
            name="passValue"
          />
          <FBCheckbox
            label="form.builder.fai"
            name="fai"
          />
        </>
      )}
      {children}
    </FBForm>
  </FBEditor>
);

export default withFBEditorTextFieldWithRange(FBEditorTextFieldWithRange);
