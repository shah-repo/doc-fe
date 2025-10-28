import { Grid, TextField, TextFieldProps } from '@material-ui/core';
import { RenderInputParams } from '@material-ui/lab/Autocomplete';
import React from 'react';
import { FBInputProps } from '../types/common';
import useStyles from './styles';

type FBTextFieldProps =
  & FBInputProps
  & Partial<Omit<RenderInputParams, 'InputProps'>>
  & Pick<TextFieldProps, 'InputProps'>;

const FBSalesOrderNumber: React.FC<FBTextFieldProps> = ({
  rows = 1,
  placeholder,
  id,
  disabled,
  InputLabelProps,
  InputProps,
  inputProps,
  defaultValue,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.grid}>
      <Grid item xl="auto">
      <TextField
        multiline={Boolean(rows && (rows as number) > 1)}
        variant="outlined"
        label=""
        id="FBTextField-input"
        {...{ rows, placeholder, InputLabelProps, InputProps, inputProps }}
      />
      </Grid>
    </Grid>
  );
};

export default FBSalesOrderNumber;
