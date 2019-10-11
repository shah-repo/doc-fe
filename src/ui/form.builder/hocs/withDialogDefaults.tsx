import { useTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import { FBDialogProps } from "../types/dialog";

export function withDialogDefaults<T extends FBDialogProps>(
  Component: React.ComponentType<T>,
) {

  return (props: T) => {
    const FullScreen = (maxWidth: Breakpoint = "sm") => {
      const theme = useTheme();
      const fullScreen = useMediaQuery(theme.breakpoints.down(maxWidth));
      if (!props.fullScreen) {
        return fullScreen;
      }
      return props.fullScreen;
    };

    return <Component {...props} fullScreen={FullScreen(props.maxWidth)} />;
  };
}
