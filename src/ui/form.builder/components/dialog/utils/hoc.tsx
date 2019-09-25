import { Button, DialogActions } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useState } from "react";
import Text from "../../../../components/Text";
import { Subtract } from "../../common/utils/types";
import { FBDialogAction, FBDialogActionLabel, FBDialogInjectedProps, FBDialogProps } from "./types";

export function withDialogStates<T extends FBDialogInjectedProps>(
  Component: React.ComponentType<T>,
) {
  return class extends React.Component<Subtract<T, FBDialogInjectedProps>> {
    public state = { open: false as boolean, children: this.props.children };

    public setOpen = () => this.setState({ open: true });
    public setClose = () => this.setState({ open: false });
    public setChildren = (el: JSX.Element) => this.setState({ ...this.state, children:  el });

    public render() {
      return (
        <Component
          {...this.props as T}
          setDialogOpen={this.setOpen}
          setDialogClose={this.setClose}
          setDialogChildren={this.setChildren}
          open={this.state.open}
          children={this.state.children}
        />
      );
    }
  };
}

export function withDialogDefaults<T extends FBDialogProps>(
  Component: React.ComponentType<T>,
) {

  return (props: T) => {
    const fullScreen = (maxWidth: Breakpoint = "sm") => {
      if (!props.fullScreen) {
        return useMediaQuery(useTheme().breakpoints.down(maxWidth));
      }
      return props.fullScreen;
    };

    return <Component {...props} fullScreen={fullScreen(props.maxWidth)} />;
  };
}

export function withDialogActions<T extends FBDialogProps>(
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
