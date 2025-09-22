import { Box } from '@material-ui/core';
import React from 'react';
import { FBInput, FBInputProps, FBTextField } from '..';
import { styles } from '../styles/FBEditorCheckbox.styles';
import { withFBRange } from './FBRange.wrap';

const FBRange: React.FunctionComponent<FBInputProps> = ({
  name = '',
  ...props
}) => {
  const classes = styles();
  return (
    <FBInput
      {...props}
      {...{ name }}
      type="range"
    >
      <Box display="flex">
        <FBTextField
          boxProps={{ mr: 2, flexGrow: 1 }}
          className={classes.passValue}
          type="number"
          rules="required_if:editorConfig.hasRange,true"
          validationAttribute="common.empty.string"
          placeholder="form.builder.from"
          name={`${name}.from`}
          gutter={false}
        />
        <FBTextField
          type="number"
          rules="required_if:editorConfig.hasRange,true"
          validationAttribute="common.empty.string"
          placeholder="form.builder.to"
          name={`${name}.to`}
          boxProps={{ flexGrow: 1 }}
          className={classes.passValue}
          gutter={false}
        />
      </Box>
    </FBInput>
  );
};

export default withFBRange(FBRange);
