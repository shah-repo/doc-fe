import { useTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import { FBDialogProps } from "../types/dialog";

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
