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
    stepLHRs,
    isHovering,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    stepLHRs = workspaceState?.document?.smartReferencesFrom
      ?.find((ref) => ref.type === "HIDDEN_PI_INSTANCE" && ref.metadata.fieldId === name)?.fromDocRev;
    const lhrStepState = FB.useRef(FBLHRStepState, stepLHRs);
    const schemaItem = workspaceState?.getSchemaItemAt(index);
    const isOutput = Boolean(workspaceState?.isOutput);
    // console.log(schemaItem?.editorConfig.value);

    // MARK: @helpers
    React.useEffect(() => {
      if (lhrStepState.stepLHRs) {
        setDisplayToLHRs();
      } else {
        setDisplayToMPI();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions
    // on MPI input change
    React.useEffect(() => reaction(
      () => formState?.inputState.get(name)?.value,
      (value) => {
        if (typeof value === "string") { // don't trigger if it is LHR/MPI hover toggle
          workspaceState?.setSchemaItem({
            ...schemaItem,
            editorConfig: {
              ...schemaItem?.editorConfig,
              value,
            },
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on LHRS create
    React.useEffect(() => reaction(
      () => lhrStepState.startMpiApi.data,
      (docRev) => {
        window.open(
          `/document_revision/${docRev?.documentId}/version/${docRev?.id}`,
          "_blank"
        );
        lhrStepState
          .setLHRs(docRev);
        setDisplayToLHRs();
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

    const setDisplayToMPI = () => {
      lhrStepState.setIsHovering(true);
      formState?.setFieldValue(name, schemaItem?.editorConfig?.value);
      // console.log(formState?.getFieldValue(name)?.name);
      formState?.getInputState(name)?.setRender();
    };

    const setDisplayToLHRs = () => {
      lhrStepState.setIsHovering(false);
      if (!lhrStepState.stepLHRs) { return; }
      // console.log(formState?.getFieldValue(name)?.name);
      formState?.setFieldValue(name, lhrStepState.stepLHRs);
      formState?.getInputState(name)?.setRender();
    };


    // MARK: @observer
    useObserver(() => {
      loading = lhrStepState?.startMpiApi.loading;
      stepLHRs = lhrStepState.stepLHRs;
      isHovering = lhrStepState.isHovering;
    });


    return Component({
      ...(props as T),
      name,
      isOutput,
      startMpi,
      lhrStepState,
      stepLHRs,
      setDisplayToMPI,
      setDisplayToLHRs,
      isHovering,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
