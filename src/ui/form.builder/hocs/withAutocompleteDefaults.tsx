import { Box } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CancelIcon from "@material-ui/icons/Cancel";
import React from "react";
import { ValueContainerProps } from "react-select/src/components/containers";
import { ControlProps } from "react-select/src/components/Control";
import { MenuProps, NoticeProps } from "react-select/src/components/Menu";
import { MultiValueProps } from "react-select/src/components/MultiValue";
import { OptionProps } from "react-select/src/components/Option";
import { SelectOption } from "../../components/forms/fields/Select";
import {
  FBAutocompleteInjectedProps,
  FBAutocompleteProps,
  InputComponentProps,
  MuiPlaceholderProps,
} from "../types/autocomplete";
import { Subtract } from "../types/common";
import { withLabelRenderer } from "./withLabelRenderer";
import { withOnChange } from "./withOnChange";

export function withAutocompleteDefaults<T extends FBAutocompleteProps>(
  Component: React.ComponentType<T>,
) {

  class HOC extends React.Component<Subtract<T, FBAutocompleteInjectedProps>> {

    public render() {
      return (
        <Component
          {...this.props as T}
          components={this.components()}
        />
      );
    }

    private components = () => ({
      Control: this.Control,
      Menu: this.Menu,
      MultiValue: this.MultiValue,
      NoOptionsMessage: this.NoOptionsMessage,
      Option: this.Option,
      Placeholder: this.Placeholder,
      ValueContainer: this.ValueContainer,
    })

    private inputComponent = ({ inputRef, ...props }: InputComponentProps) =>
      <div ref={inputRef} {...props} />

    private NoOptionsMessage = (props: NoticeProps<SelectOption>) => (
      <Box p={1}>
        {props.children}
      </Box>
    )

    private Control = (props: ControlProps<SelectOption>) => {
      const theme = useTheme();
      const {
        children,
        innerProps,
        innerRef,
        selectProps: { TextFieldProps },
      } = props;

      return (
        <TextField
          fullWidth={true}
          InputProps={{
            inputComponent: this.inputComponent,
            inputProps: {
              style: {
                display: "flex",
                padding: theme.spacing(1.05),
                height: "auto",
              },
              ref: innerRef,
              children,
              ...innerProps,
            },
          }}
          {...TextFieldProps}
          variant="outlined"
        />
      );
    }

    private Option = (props: OptionProps<SelectOption>) => (
      <div
        ref={props.innerRef}
        style={{
          fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
      >
        <MenuItem selected={props.isFocused}>
          {props.children}
        </MenuItem>
      </div>
    )

    private Placeholder = (props: MuiPlaceholderProps) => (
      <Box
        fontSize="subtitle1.fontSize"
        color="text.hint"
        px={1}
        {...props.innerProps}
        hidden={props.selectProps.inputId === (document.activeElement && document.activeElement.id)}
      >
          {props.children}
      </Box>
    )

    private ValueContainer = (props: ValueContainerProps<SelectOption>) => (
      <Box
        display="flex"
        flexWrap="wrap"
        flex={1}
        alignItems="center"
      >
        {props.children}
      </Box>
    )

    private MultiValue = (props: MultiValueProps<SelectOption>) => (
      <Box
        mx={0.5}
        my={0.25}
      >
        <Chip
          tabIndex={-1}
          label={props.children}
          onDelete={props.removeProps.onClick}
          deleteIcon={<CancelIcon {...props.removeProps} />}
        />
      </Box>
    )

    private Menu = (props: MenuProps<SelectOption>) => (
      <Box
        zIndex="tooltip"
        bgcolor="white"
        position="absolute"
        boxShadow={3}
        left={0}
        right={0}
        mt={1}
        {...props.innerProps}
      >
        {props.children}
      </Box>
    )
  }

  return withOnChange(withLabelRenderer(HOC));
}
