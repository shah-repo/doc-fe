import { observer } from "mobx-react";
import React from "react";
import { FBWorkspaceProps } from "../types/workspace";
import FBStore from "../stores/ui/FBStore";

export const withWorkspace = <T extends FBWorkspaceProps>(
  Component: React.FunctionComponent<T>,
) => {
  return observer((props: T) => {
    if (props.mode) {
      FBStore.setMode(props.mode);
    }
    const { schema, mode, values } = FBStore;
    const isStarter = (mode === "design" && schema.length === 0);

    return Component({
      ...props,
      isStarter,
      mode,
      schema,
      values,
    });
  });
};
