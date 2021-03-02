import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBLHRStepProps, FBLHRStepState } from "..";

export const withFBLHRStep = <T extends FBLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name = "",
    index,
    loading,
    startMpi,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const lhrStepState = FB.useRef(FBLHRStepState);
    const schemaItem = workspaceState?.getSchemaItemAt(index);
    const isOutput = Boolean(workspaceState?.isOutput);

    // MARK: @helpers
    React.useEffect(() => {
      formState?.setFieldValue(name, schemaItem?.editorConfig?.value);
      formState?.getInputState(name)?.setRender();
      formState?.validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions
    // on MPI input change
    React.useEffect(() => reaction(
      () => formState?.inputState.get(name)?.value,
      (value) => {
        workspaceState?.setSchemaItem({
          ...schemaItem,
          editorConfig: {
            ...schemaItem?.editorConfig,
            value,
          },
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on LHRS create
    React.useEffect(() => reaction(
      () => lhrStepState.startMpiApi.data,
      (docRev) => {
        window.open(
          `/document_revision/${docRev.documentId}/version/${docRev.id}`,
          "_blank"
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);


    // MARK: @methods
    startMpi = () => {
      lhrStepState.startMpi(
        name,
        workspaceState?.document?.id,
        schemaItem?.editorConfig?.value
      );
    };

    // MARK: @observer
    useObserver(() => {
      loading = lhrStepState?.startMpiApi.loading;
    });


    return Component({
      ...(props as T),
      name,
      isOutput,
      startMpi,
      lhrStepState,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
