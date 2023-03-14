import React from "react";
import { ThemeNext } from ".";

export default <T extends {}>(Component: React.ComponentType<T>) =>
  React.forwardRef<unknown, T>(function withThemeNext(props, ref) {
    return <ThemeNext><Component {...props as T} ref={ref} /></ThemeNext>;
  });
