import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBAutocompleteAsyncOption, FBLHRStepProps, FBLHRStepState } from "..";
import { DocumentRevision, SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { getHighestRevision } from "../../documentRevision/forms/transform";
import { isDocumentRevisionInDraft } from "../../documentRevision/helpers/documentRevisionStatus";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

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
    disabled,
    materials,
    equipment,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    stepLHRs = workspaceState?.document?.smartReferencesFrom
      ?.find((ref) => ref.type === SmartReferenceType.HiddenPiInstance && ref.metadata.fieldId === name)?.fromDocRev;
    const lhrStepState = FB.useRef(FBLHRStepState, stepLHRs);
    const schemaItem = workspaceState?.getSchemaItemAt(index);
    const isOutput = Boolean(workspaceState?.isOutput);
    const isDraft = isDocumentRevisionInDraft(workspaceState?.document?.status);
    const editorconfig =  {
      equipment: [
        {
          id: "knftnpok",
          title: "12eb3808-3aa2-403d-8da7-44491eb65322",
        },
        {
          id: "C",
          type: "params",
          title: "12eb3808-3aa2-403d-8da7-44491eb65322",
        },
        {
          id: "D",
          type: "params",
          title: "546c63fb-0824-4b18-aa85-7e723eed2982",
        },
      ],
      materials: [
        {
          id: "B",
          type: "params",
          title: "a5bb8d44-6622-4c0b-beca-1284bd23ae40",
        },
        {
          id: "knftn2za",
          unit: "cases",
          title: "6c40896d-ddcf-497a-8650-332d2d61555b",
          quantity: 1,
        },
        {
          id: "A",
          type: "params",
          title: "a5bb8d44-6622-4c0b-beca-1284bd23ae40",
        },
        {
          id: "E",
          type: "params",
          title: "Test materials part",
        },
      ],
      description: "<ul>\n<li>btbtrbrgtrgrtrttest abc 12345666</li>\n</ul>",
    };

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
        if (!stepLHRs) { // don't trigger if it is LHR/MPI hover toggle
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
        openLHRs(docRev);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on get document by id
    React.useEffect(() => reaction(
      () => lhrStepState.getDocumentApi.data,
      (document) => {
        if (!document) { return; }
        const highestRev = getHighestRevision(document.documentRevisions);
        if (!highestRev) { return; }
        window.open(
          `/document_revision/${highestRev.documentId}/version/${highestRev.id}`,
          "_self"
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.mpiDocuments),
      (data) => {
        console.log(Array.from(data.values()));
        const materilasWithParams = editorconfig.materials.filter((item) => item.type === "params");
        const equipmentWithParams = editorconfig.equipment.filter((item) => item.type === "params");
        lhrStepState.setMaterials(materilasWithParams);
        lhrStepState.setEquipment(equipmentWithParams);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @methods
    startMpi = () => {
      let startQuantity = formState?.getFieldValue(`fb-lhrs-start-quantity-${name}`);
      if (!startQuantity || startQuantity === "") {
        startQuantity = 1;
      }
      lhrStepState.startMpi(
        name,
        startQuantity,
        workspaceState?.document?.id,
        schemaItem?.editorConfig?.value,
      );
    };

    const openLHRs = (docRev?: DocumentRevision) => {
      const documentRevision = docRev || stepLHRs;
      if (!documentRevision) { return; }
      lhrStepState.getLHRsDocument(documentRevision.documentId);
    };

    const setDisplayToMPI = () => {
      lhrStepState.setIsHovering(true);
      formState?.setFieldValue(name, schemaItem?.editorConfig?.value);
      formState?.getInputState(name)?.setRender();
    };

    const setDisplayToLHRs = () => {
      lhrStepState.setIsHovering(false);
      if (!lhrStepState.stepLHRs) { return; }
      FBAutocompleteAsyncStore.add(
        FBAutocompleteAsyncOption.mpiDocuments,
        lhrStepState.stepLHRs.id,
        lhrStepState.stepLHRs
      );
      formState?.setFieldValue(name, lhrStepState.stepLHRs.id);
      formState?.getInputState(name)?.setRender();
    };

    // MARK: @observer
    useObserver(() => {
      loading = lhrStepState?.startMpiApi?.loading || lhrStepState?.getDocumentApi?.loading;
      stepLHRs = lhrStepState.stepLHRs;
      isHovering = lhrStepState.isHovering;
      materials = lhrStepState?.materials;
      equipment = lhrStepState?.equipment;
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
      disabled,
      loading,
      materials,
      index,
      equipment,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
