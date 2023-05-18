import { Box } from '@material-ui/core';
import React from 'react';
import { FBInput, FBInputProps, FBTextField } from '..';
import { styles } from '../styles/FBEditorCheckbox.styles';

const FBPassPercentage: React.FunctionComponent<FBInputProps> = ({
  name,
  ...props
}) => {
  const classes = styles();
  return (
    <FBInput
      {...props}
      {...{ name }}
      type="passpercentage"
      name={`${name}`}
      boxProps={{ display: 'flex', flexDirection: 'column' }}
      gutter={false}
    >
      <FBTextField
        className={classes.passValue}
        name={`${name}.value`}
        boxProps={{ mb: 1.5 }}
      />
      <Box display="flex">
        <FBTextField
          className={classes.passValue}
          name={`${name}.increase`}
          boxProps={{ flexGrow: 1, mr: 2, mb: 0 }}
          type="number"
          placeholder="+ 00"
        />
        <FBTextField
          className={classes.passValue}
          name={`${name}.decrease`}
          boxProps={{ flexGrow: 1, mb: 0 }}
          type="number"
          placeholder="- 00"
        />
      </Box>
    </FBInput>
  );
};

export default FBPassPercentage;
