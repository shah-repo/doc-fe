import { find, flattenDeep, omit } from "lodash";
import { reaction } from "mobx";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBAutocompleteAsyncOption, FBLHRStepProps, FBLHRStepState } from "..";
import { DocumentRevision, SmartReferenceType } from "../../../state/ducks/documentRevisions/types";
import { getHighestRevision, getLatesReferenceVersion } from "../../documentRevision/forms/transform";
import { isDocumentRevisionInDraft } from "../../documentRevision/helpers/documentRevisionStatus";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";

export const withFBLHRStep = <T extends FBLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    filterOptions,
    name = "",
    index,
    loading,
    startMpi,
    stepLHRs,
    isHovering,
    disabled,
    ownerOfStartMPIAction,
    ownerOfCompleteMPIAction,
    materials,
    equipment,
    isDocumentLHRT,
    stepIndex,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const smartReferencesFrom = workspaceState?.document?.smartReferencesFrom?.filter( (ref) => ref.active
      && ref.type === SmartReferenceType.HiddenPiInstance
      && ref.metadata.fieldId === name);

    const highestReference = getLatesReferenceVersion(smartReferencesFrom);
    stepLHRs = highestReference?.fromDocRev;

    const employees = workspaceState?.externalState?.company?.companyMine.employees;
    ownerOfStartMPIAction = employees?.find((e) =>
      e.id === smartReferencesFrom?.[0]?.metadata.startedBy)?.user?.name;
    ownerOfCompleteMPIAction = employees?.find((e) =>
      e.id === smartReferencesFrom?.[0]?.metadata.completedBy)?.user?.name;
    const lhrStepState = FB.useRef(FBLHRStepState, stepLHRs);
    const schemaItem = workspaceState?.getSchemaItemAt(index);
    const isOutput = Boolean(workspaceState?.isOutput);
    const isDraft = isDocumentRevisionInDraft(workspaceState?.document?.status);
    // TO DO: Find another way with BE to chechk if doc is LHRT
    isDocumentLHRT = workspaceState?.document?.document.documentType.documentTypeAcronym === "LHRT-";

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
          const editorConfig = !value ? omit(schemaItem?.editorConfig, "parameters") : schemaItem?.editorConfig;
          workspaceState?.setSchemaItem({
            ...schemaItem,
            editorConfig: {
              ...editorConfig,
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
        const parameters = schemaItem?.editorConfig.parameters;
        const dataValues = Array.from(data.values());
        const mpiDocument: any = dataValues.find((item: any) => item?.id === schemaItem?.editorConfig.value);

        const editorCfg = mpiDocument?.formTemplate.schema.filter((item) =>
          item.type === "mpiprocedure" && !item.deleted);
        const editorMaterials = editorCfg.filter((item) => item.editorConfig.materials).map(
          (item) => item.editorConfig.materials);
        const editorEquipment = editorCfg.filter((item) => item.editorConfig.equipment).map(
          (item) => item.editorConfig.equipment );

        if (parameters) {
          const newMaterials = flattenDeep([editorMaterials]).map((material) => {
            const editedMaterial = find(parameters, (parameter) => parameter.paramsId === material.id);
            return editedMaterial || material;
          });
          const newEquipments = flattenDeep([editorEquipment]).map((equipment) => {
            const editedEquipment = find(parameters, (parameter) => parameter.paramsId === equipment.id);
            return editedEquipment || equipment;
          });
          lhrStepState.setMaterials(newMaterials);
          lhrStepState.setEquipment(newEquipments);
          lhrStepState.setEditedParameters(parameters);
          return;
        }

        lhrStepState.setMaterials(flattenDeep([editorMaterials]));
        lhrStepState.setEquipment(flattenDeep([editorEquipment]));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @methods
    startMpi = () => {
      lhrStepState.startMpi(
        name,
        workspaceState?.document?.id,
        schemaItem?.editorConfig?.value,
        stepIndex,
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

    function handleFilter(
      data: DocumentRevision[],
    ) {
      const { documentType = [], revisionStatus = [] } = props.editorConfig?.filters || {};
      if (documentType.length === 0 && revisionStatus.length === 0) { return data; }
      const options = data?.filter((docRev) => {
        const {
          status = "",
          document: { documentType: { id: docTypeId = "" } = {} } = {},
        } = docRev || {};
        return revisionStatus.includes(status) && documentType.includes(docTypeId);
      });
      return options;
    }

    filterOptions = (options) => handleFilter(options);

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
      filterOptions,
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
      ownerOfStartMPIAction,
      ownerOfCompleteMPIAction,
      materials,
      index,
      equipment,
      isDocumentLHRT,
      stepIndex,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
