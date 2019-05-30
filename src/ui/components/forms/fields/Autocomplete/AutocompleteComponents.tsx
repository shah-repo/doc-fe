import * as React from 'react';
import { ControlProps } from 'react-select/lib/components/Control';
import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';
import { OptionType } from './types';

type InputComponentProps = Pick<BaseTextFieldProps, 'inputRef'> & React.HTMLAttributes<HTMLDivElement>;

const inputComponent = ({ inputRef, ...props }: InputComponentProps) => {
  return <div ref={inputRef} {...props} />;
}

const Control = (props: ControlProps<OptionType>) => {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.TextFieldProps}
    />
  );
}

const AutcompleteComponents = {
  Control,
  DropdownIndicator: null,
  ClearIndicator: null,
}

export default AutcompleteComponents;