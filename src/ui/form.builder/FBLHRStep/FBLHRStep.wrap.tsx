import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBLHRStepProps, FBLHRStepState } from "..";
import { isDocumentRevisionInDraft } from "../../documentRevision/helpers/documentRevisionStatus";

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
    const isDraft = isDocumentRevisionInDraft(workspaceState?.document?.status);

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
        if (!docRev) { return; }
        lhrStepState
          .setLHRs(docRev);
        setDisplayToLHRs();
        openLHRs();
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

    const openLHRs = () => {
      window.open(
        `/document_revision/${stepLHRs?.documentId}/version/${stepLHRs?.id}`,
        "_blank"
      );
    };

    const setDisplayToMPI = () => {
      lhrStepState.setIsHovering(true);
      formState?.setFieldValue(name, schemaItem?.editorConfig?.value);
      formState?.getInputState(name)?.setRender();
    };

    const setDisplayToLHRs = () => {
      lhrStepState.setIsHovering(false);
      if (!lhrStepState.stepLHRs) { return; }
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
      openLHRs,
      isDraft,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
