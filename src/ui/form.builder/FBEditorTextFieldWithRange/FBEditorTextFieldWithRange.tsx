import { Box, InputAdornment } from '@material-ui/core';
import React from 'react';
import { FBCheckbox, FBEditor, FBEditorPlaceholder, FBEditorTextFieldWithRangeProps, FBRange, FBTextField } from '..';
import { styles as AutoCompleteStyles } from '../styles/FBAutocomplete.styles';
import { styles } from '../styles/FBEditorCheckbox.styles';
import useToleranceStyles from './FBEditorTextFieldWithRange.styles';
import { withFBEditorTextFieldWithRange } from './FBEditorTextFieldWithRange.wrap';

const FBEditorTextFieldWithRange: React.FunctionComponent<FBEditorTextFieldWithRangeProps> = ({
  formState,
  children,
  inputProps,
  ...props
}) => {
  const classes = styles();
  const editorClasses = useToleranceStyles();

  const type = inputProps?.type ?? 'textfieldwithrange';

  return (
    <div className={editorClasses.editor}>
      <FBEditor {...props} {...{ inputProps, formState, type }}>
        <FBTextField
          key="label"
          dataCy={`fb-editor-field-${type}`}
          label="form.builder.label"
          name="label"
          rules="required"
          className={classes.textfield}
          boxProps={{ mb: 3.125, className: classes.error }}
          labelProps={AutoCompleteStyles.labelProps}
          isFbEditorField
        />
        <FBEditorPlaceholder
          key={`fb-editor-placeholder-${type}`}
          boxProps={{ mb: 3.125 }}
          labelProps={AutoCompleteStyles.labelProps}
          className={classes.textfield}
          isFbEditorField
        />

        <Box mb={5}>
          <FBCheckbox
            label="form.builder.include.units"
            name="editorConfig.hasUnits"
            gutter={false}
            withState
          />
          <FBCheckbox
            label="form.builder.range"
            name="editorConfig.hasRange"
            gutter={false}
            withState
          />
          <FBRange name="editorConfig.range" />
          <FBCheckbox
            label="form.builder.tolerance"
            name="editorConfig.hasTolerance"
            validationAttribute="form.builder.tolerance"
            gutter={false}
            withState
          />
          <FBTextField
            name="editorConfig.tolerance"
            validationAttribute="form.builder.tolerance"
            type="number"
            gutter={false}
            withState
            labelProps={AutoCompleteStyles.labelProps}
            boxProps={{ mb: 2 }}
            rules="required_if:editorConfig.hasTolerance,true"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" className={editorClasses.toleranceAdornment}>+/-</InputAdornment>
              ),
              className: editorClasses.toleranceField,
            }}
            inputProps={{
              min: 0,
            }}
          />
          <FBCheckbox
            label="form.builder.critical.to.quality"
            name="editorConfig.isCriticalToQuality"
            gutter={false}
            withState
          />
          <FBCheckbox
            label="form.builder.inspection"
            name="editorConfig.isInspected"
            gutter={false}
            withState
          />
        </Box>
        {children}
      </FBEditor>
    </div>
  );
};
export default withFBEditorTextFieldWithRange(FBEditorTextFieldWithRange);
