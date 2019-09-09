import { Button, DialogActions } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import Text from "../../../../components/Text";
import { Subtract } from "../../common/utils/types";
import { FBDialogAction, FBDialogActionLabel, FBDialogInjectedProps, FBDialogProps } from "./types";

export function withDialogStates<T extends FBDialogInjectedProps>(
  Component: React.ComponentType<T>,
) {
  return class extends React.Component<Subtract<T, FBDialogInjectedProps>> {
    public state = { open: false as boolean };

    public setOpen = () => this.setState({ open: true });
    public setClose = () => this.setState({ open: false });

    public render() {
      return (
        <Component
          {...this.props as T}
          setDialogOpen={this.setOpen}
          setDialogClose={this.setClose}
          open={this.state.open}
        />
      );
    }
  };
}

export function withDialogSettings<T extends FBDialogProps, U>(
  Component: React.ComponentType<T>,
) {

  return (props: T) => {
    const fullScreen = (maxWidth: Breakpoint = "sm") =>
      useMediaQuery(useTheme().breakpoints.down(maxWidth));

    return <Component fullScreen={fullScreen(props.maxWidth)} {...props} />;
  };
}

export function withDialogActions<T extends FBDialogProps, U>(
  Component: React.ComponentType<T>,
) {

  return (props: T) => {

    const onActionClick = (action: FBDialogAction) => () => {
      if (props.onActionClick) {
        props.onActionClick(action);
      }
    };

    const actionRenderer = () => props.actions!.map((action, i) => {
      const text = FBDialogActionLabel[action];
      return (
        <Button
          key={`dialogAction-${action}-${i}`}
          variant="contained"
          color="primary"
          onClick={onActionClick(action)}
        >
          <Text message={text} />
        </Button>
      );
    });

    return (
      <Component {...props} >
        {props.children}
        {props.actions && <DialogActions>{actionRenderer()}</DialogActions>}
      </Component>
    );
  };
}
