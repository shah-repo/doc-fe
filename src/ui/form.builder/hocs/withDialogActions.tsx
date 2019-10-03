import { Button, DialogActions } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";
import {
  FBDialogAction,
  FBDialogActionLabel,
  FBDialogProps,
} from "../types/dialog";

export function withDialogActions<T extends FBDialogProps>(
  Component: React.ComponentType<T>,
) {

  return (props: T) => {

    const onActionClick = (action: FBDialogAction) => () => {
      if (props.onActionClick) {
        props.onActionClick(action);
      }
    };

    const actionRenderer = () => props.actions && props.actions!.map((action, i) => {
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
