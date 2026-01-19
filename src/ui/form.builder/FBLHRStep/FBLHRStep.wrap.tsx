import { FilterOptionsState } from '@material-ui/lab/useAutocomplete';
import { find, flattenDeep, lowerCase, omit } from 'lodash';
import { ObservableMap, reaction } from 'mobx';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBAutocompleteAsyncOption, FBLHRStepProps, FBLHRStepState } from '..';
import { SM } from '../../../App';
import { MomentFormats, convertDateTimeToPST, useDate } from '../../../common/utils/date';
import { DocumentRevision, DocumentRevisionStatus, SmartReferenceType } from '../../../state/ducks/documentRevisions/types';
import { getHighestRevision, getLatesReferenceVersion } from '../../documentRevision/forms/transform';
import { isDocumentRevisionInDraft, isDocumentRevisionPendingChange } from '../../documentRevision/helpers/documentRevisionStatus';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
import { LHRS_END_DATE, LHRS_START_DATE } from './utils';

export const withFBLHRStep = <T extends FBLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    filterOptions,
    startMpi,
    name = '',
    index,
    loading,
    stepLHRs,
    disabled,
    ownerOfStartMPIAction,
    ownerOfCompleteMPIAction,
    materials,
    equipment,
    isDocumentLHRT,
    stepIndex,
    label,
    ...props
  }: T) => {
    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const { getFormattedDateString } = useDate();
    const smartReferencesFrom = workspaceState?.document?.smartReferencesFrom?.filter((ref) => ref.active
      && ref.type === SmartReferenceType.HiddenPiInstance
      && ref.metadata.fieldId === name);

    const { _tabsState } = SM.useStores();
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
    const lhrBuildTypeExist = formState?.getFieldValue('lhr-build-type');
    const isDraft = isDocumentRevisionInDraft(workspaceState?.document?.status);
    const isPendingChange = isDocumentRevisionPendingChange(workspaceState?.document?.status);

    // TO DO: Find another way with BE to chechk if doc is LHRT
    isDocumentLHRT = workspaceState?.document?.document.documentType.documentTypeAcronym === 'LHRT-';

    const startDateFieldName = LHRS_START_DATE;
    const endDateFieldName = LHRS_END_DATE;

    if (!(isOutput && stepLHRs)) {
      formState?.setFieldValue(name, schemaItem?.editorConfig?.value);
    } else if (stepLHRs) {
      const startDate = formState?.getFieldValue(startDateFieldName) || stepLHRs?.formInput?.[startDateFieldName] || stepLHRs?.createdAt;
      const endDate = formState?.getFieldValue(endDateFieldName) || stepLHRs?.formInput?.[endDateFieldName] || stepLHRs?.releasedAt;

      if (startDate && startDate !== formState?.getFieldValue(startDateFieldName)) {
        // Format the date to MM/DD/YYYY format expected by FBDatePicker
        const formattedStartDate = getFormattedDateString(startDate, MomentFormats.MonthDateYearTwoDigit);
        formState?.setFieldValue(startDateFieldName, formattedStartDate);
      }
      if (endDate && endDate !== formState?.getFieldValue(endDateFieldName)) {
        // Format the date to MM/DD/YYYY format expected by FBDatePicker
        const formattedEndDate = getFormattedDateString(endDate, MomentFormats.MonthDateYearTwoDigit);
        formState?.setFieldValue(endDateFieldName, formattedEndDate);
      }
    }

    // MARK: @helpers
    React.useEffect(() => {
      formState?.setValidationAttributeName(name, label as string);
      formState?.validate();
      if (!lhrStepState.stepLHRs) {
        return;
      }
      setDisplayToLHRs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions
    // on MPI input change
    React.useEffect(() => reaction(
      () => formState?.inputState.get(name)?.value,
      (value) => {
        if (!stepLHRs) { // don't trigger if it is LHR/MPI hover toggle
          const editorConfig = !value ? omit(schemaItem?.editorConfig, 'parameters') : schemaItem?.editorConfig;
          workspaceState?.setSchemaItem({
            ...schemaItem,
            editorConfig: {
              ...editorConfig,
              value,
            },
          });
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => formState?.approvalMap,
      (value) => value && (lhrStepState?.setApproval(value)),
      { fireImmediately: true },
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
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
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // on get document by id
    React.useEffect(() => reaction(
      () => lhrStepState.getDocumentApi.data,
      (document) => {
         _tabsState?.setTabClickRestriction(false);
         if (!document) { return; }
         const highestRev = getHighestRevision(document.documentRevisions);
         if (!highestRev) { return; }
         window.open(
          `/document_revision/${highestRev.documentId}/version/${highestRev.id}`,
          '_self',
         );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => [
        FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.mpiDocuments),
        formState?.inputState.get(name)?.value,
      ] as [ObservableMap<string, DocumentRevision>, string | undefined],
      ([mpiDocuments, mpiDocumentId]) => {
        const parameters = schemaItem?.editorConfig?.parameters;
        const mpiDocument = Array.from(mpiDocuments.values()).find((item) => item?.id === mpiDocumentId);

        const editorCfg = mpiDocument?.formTemplate?.schema.filter((item) =>
          item.type === 'mpiprocedure' && !item.deleted) || [];
        const editorMaterials = editorCfg.filter((item) => item.editorConfig?.materials).map(
          (item) => item.editorConfig.materials);
        const editorEquipment = editorCfg.filter((item) => item.editorConfig?.equipment).map(
          (item) => item.editorConfig.equipment);

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
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      const disposer = reaction(
        () => [
          formState?.inputState.get(startDateFieldName)?.value,
          formState?.inputState.get(endDateFieldName)?.value,
        ],
        ([startDate, endDate]) => {
          if (!stepLHRs || !lhrStepState) { return; }

          // Clear any existing timeout to debounce rapid changes
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          // Debounce the update to prevent multiple API calls
          timeoutId = setTimeout(() => {
            // Re-check stepLHRs since it might have changed during the timeout
            if (!stepLHRs || !lhrStepState) { return; }

            // Check if there are actual changes before updating
            const currentStartDate = stepLHRs.formInput?.[LHRS_START_DATE] as string | undefined;
            const currentEndDate = stepLHRs.formInput?.[LHRS_END_DATE] as string | undefined;

            // Convert form dates to ISO format for comparison
            const isoStartDate = startDate ? convertDateTimeToPST(startDate, MomentFormats.AsyncTasksDefaultDateTimeFormatter) : undefined;
            const isoEndDate = endDate ? convertDateTimeToPST(endDate, MomentFormats.AsyncTasksDefaultDateTimeFormatter) : undefined;

            // Only update if there are actual changes
            if (isoStartDate !== currentStartDate || isoEndDate !== currentEndDate) {
              lhrStepState.updateLHRStepDates(isoStartDate, isoEndDate);
            }
          }, 500); // 500ms debounce to allow both dates to be set
        },
        { fireImmediately: false },
      );

      // Cleanup function
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        disposer();
        lhrStepState?.cleanup?.();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepLHRs?.id]);

    // MARK: @methods
    startMpi = () => {
       _tabsState?.setTabClickRestriction(true);
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

    const setDisplayToLHRs = () => {
      if (isOutput && stepLHRs) {
        if (!lhrStepState.stepLHRs) { return; }
        FBAutocompleteAsyncStore.add(
          FBAutocompleteAsyncOption.mpiDocuments,
          lhrStepState.stepLHRs.id,
          lhrStepState.stepLHRs,
        );
      formState?.setFieldValue(name, lhrStepState.stepLHRs.id);
      formState?.getInputState(name)?.setRender();
      }
    };

    const filterOutOption = (docRev: DocumentRevision, inputValue: string) => {
      const filterValue = lowerCase(inputValue);

      return lowerCase(docRev.name).includes(filterValue)
        || lowerCase(docRev.document.docId).includes(filterValue);
    };

    function handleFilter (
      data: DocumentRevision[],
      state: FilterOptionsState,
    ) {
      const { inputValue = '' } = state || {};

      const options = data?.filter((docRev) => (docRev.status === DocumentRevisionStatus.Draft
        || docRev.status === DocumentRevisionStatus.Released)
          && filterOutOption(docRev, inputValue));

      return options;
    }

    filterOptions = (options, state) => handleFilter(options, state);

    // MARK: @observer
    useObserver(() => {
      loading = lhrStepState?.startMpiApi?.loading || lhrStepState?.getDocumentApi?.loading;
      stepLHRs = lhrStepState.stepLHRs;
      materials = lhrStepState?.materials;
      equipment = lhrStepState?.equipment;
    });

    return Component({
      ...(props as T),
      filterOptions,
      startMpi,
      setDisplayToLHRs,
      openLHRs,
      name,
      isOutput,
      lhrStepState,
      stepLHRs,
      isDraft,
      isPendingChange,
      disabled,
      loading,
      ownerOfStartMPIAction,
      ownerOfCompleteMPIAction,
      materials,
      index,
      equipment,
      isDocumentLHRT,
      stepIndex,
      lhrBuildTypeExist,
      startDateFieldName,
      endDateFieldName,
    });
  };

  Comp.displayName = 'withFBLHRStep';
  return Comp;
};
