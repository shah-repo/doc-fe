import { Dictionary } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { FB } from "..";
import { FBDialogState } from "../FBDialog";
import FBDynamicValidatorStore from "../stores/ui/FBDynamicValidatorStore";
import FBStore from "../stores/ui/FBStore";
import { FBTemplateSchema } from "../types/store";
import { FBWorkspaceProps } from "../types/workspace";
import { withFormik } from "./common/withFormik";

export const withWorkspace = <T extends FBWorkspaceProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = (props: T) => {
    const dialogState = FB.useRef<FBDialogState>(FBDialogState);

    React.useEffect(() => {
      FBDynamicValidatorStore.registerValidators();
      FBDynamicValidatorStore.validate();
      FBStore.docId = props.id || "";
      FBStore.documentId = props.documentId || "";
    }, [props.documentId, props.id]);

    if (props.mode) {
      FBStore.setMode(props.mode);
    }
    const { schema, mode, values } = FBStore;
    const isStarter = mode === "design" && schema.length === 0;

    return Component({
      ...props,
      isStarter,
      mode,
      schema,
      values,
      form: props.form,
      dialogState,
    });
  };

  return withFormik<any, FBTemplateSchema | Dictionary<any>>(
    observer((props: T) => Comp(props))
  );
};
