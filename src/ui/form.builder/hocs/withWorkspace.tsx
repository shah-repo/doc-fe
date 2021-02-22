import { Dictionary, uniqBy } from "lodash";
import { observer } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBSnackbarState } from "..";
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
    const snackbarState = FB.useRef<FBSnackbarState>(FBSnackbarState);
    // Let us change doc id value on every render
    // while FBStore is a global store and we have change company remaining data issue
    FBStore.documentId = props.documentId || "";

    React.useEffect(() => {
      // FBDynamicValidatorStore.registerValidators();
      FBDynamicValidatorStore.validate();
      FBStore.docId = props.id || "";
    }, [props.documentId, props.id, props.document]);

    if (props.mode) {
      FBStore.setMode(props.mode);
    }
    const { schema, mode, values } = FBStore;
    const isStarter = mode === "design" && schema.length === 0;

    return Component({
      ...props,
      isStarter,
      mode,
      schema: uniqBy(schema || [], "name"), // OLD: to be removed
      values,
      form: props.form,
      dialogState,
      snackbarState,
    });
  };

  return withFormik<any, FBTemplateSchema | Dictionary<any>>(
    observer((props: T) => Comp(props))
  );
};
