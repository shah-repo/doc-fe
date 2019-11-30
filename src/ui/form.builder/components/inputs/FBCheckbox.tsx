import {
  Box,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from '@material-ui/core';
import React from 'react';
import { FBCheckboxProps } from '../../types/inputs/checkbox';
import FBTextField from './FBTextField';
import { withCheckbox } from '../../hocs/inputs/withCheckbox';

const FBCheckbox: React.FunctionComponent<FBCheckboxProps> = ({
  label,
  control,
  showNote,
  error = true,
  helperText,
  disabled,
  isGroup,
  name = '',
}) => (
  <Box mb={isGroup ? 0 : 4}>
    <FormControl error={error}>
      <FormControlLabel label={label} control={control} disabled={disabled} />
      <FormHelperText>{helperText}</FormHelperText>
      {showNote && (
        <FBTextField disabled={disabled} name={`checkbox-note-${name}`} />
      )}
    </FormControl>
  </Box>
);

export default withCheckbox(FBCheckbox);
