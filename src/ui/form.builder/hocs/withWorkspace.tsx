import { observer } from "mobx-react";
import React from "react";
import FBStore from "../stores/ui/FBStore";
import { FBWorkspaceProps } from "../types/workspace";

export const withWorkspace = <T extends FBWorkspaceProps>(
  Component: React.FunctionComponent<T>,
) => {
  const component = (props: T) => {
    if (props.mode) {
      FBStore.setMode(props.mode);
    }
    const { schema, mode, values } = FBStore;
    const isStarter = (mode === "design" && schema.length === 0);

    if (props.id) {
      FBStore.docId = props.id;
    }

    return Component({
      ...props,
      isStarter,
      mode,
      schema,
      values,
    });
  };

  return observer((props: T) => component(props));
};
