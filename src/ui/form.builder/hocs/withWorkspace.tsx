import { Dictionary } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import FBDynamicValidatorStore from "../stores/ui/FBDynamicValidatorStore";
import FBStore from "../stores/ui/FBStore";
import { FBTemplateSchema } from "../types/store";
import { FBWorkspaceProps } from "../types/workspace";
import { withFormik } from "./common/withFormik";

export const withWorkspace = <T extends FBWorkspaceProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = (props: T) => {
    React.useEffect(() => {
      FBDynamicValidatorStore.registerValidators();
      FBDynamicValidatorStore.validate();
    }, []);

    if (props.mode) {
      FBStore.setMode(props.mode);
    }
    const { schema, mode, values } = FBStore;
    const isStarter = mode === "design" && schema.length === 0;

    FBStore.docId = props.id || "";

    return Component({
      ...props,
      isStarter,
      mode,
      schema,
      values,
      form: props.form
    });
  };

  return withFormik<any, FBTemplateSchema | Dictionary<any>>(
    observer((props: T) => Comp(props))
  );
};
