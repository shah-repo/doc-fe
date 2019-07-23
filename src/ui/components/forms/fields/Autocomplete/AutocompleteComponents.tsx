import * as React from 'react';
import { ControlProps } from 'react-select/lib/components/Control';
import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';
import { MultiValueProps } from 'react-select/lib/components/MultiValue';
import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
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

interface MultiValueExtendedProps extends MultiValueProps<OptionType> {
  onClick?: (value: any) => void;
}

const MultiValue = (props: MultiValueExtendedProps) => {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
      onClick={() => { props.onClick && props.onClick(props.data.value); }}
    />
  );
}

const AutcompleteComponents = {
  Control,
  DropdownIndicator: null,
  ClearIndicator: null,
  MultiValue,
}

export default AutcompleteComponents;