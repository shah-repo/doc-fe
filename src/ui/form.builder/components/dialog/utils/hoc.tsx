import { Button, DialogActions } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, { useRef } from "react";
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

export function withDialogDefaults<T extends FBDialogProps>(
  Component: React.ComponentType<T>,
) {

  return (props: T) => {
    // TODO: check if this refactoring works as expected
    const calculateFullScreen = (maxWidth: Breakpoint = "sm") =>
      useMediaQuery(useTheme().breakpoints.down(maxWidth));
    const returnFullScreen = (maxWidth: Breakpoint = "sm") =>
      props.fullScreen;
    const fullScreenRef = React.useRef(returnFullScreen);

    React.useEffect(() => {
      if (!props.fullScreen) {
        fullScreenRef.current = calculateFullScreen;
        return;
      }
      fullScreenRef.current = returnFullScreen;
    }, [props.fullScreen]);

    return <Component fullScreen={fullScreenRef.current(props.maxWidth)} {...props} />;
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
