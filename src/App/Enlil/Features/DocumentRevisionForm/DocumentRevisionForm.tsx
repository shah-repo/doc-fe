/* eslint-disable react/jsx-key */
import { filter, get, includes, map, size } from "lodash";
import { Observer } from "mobx-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionFormHeader, DocumentRevisionFormProgressBar, DocumentRevisionFormProps, DocumentRevisionHeader, DocumentRevisionLeftPanel, DocumentRevisionSidebar, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupType, DOC_TYPE_GROUP, TabInfo, TabTypeOptions } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, SmartReferenceType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { DocTypeGroups } from "../../../../ui/dashboard.new/line.items/common/types";
import DocumentRevisionFormPresenter from "../../../../ui/documentRevision/forms/DocumentRevisionForm.presenter";
import { checkIsDocumentLHR, checkIsDocumentMPIOutput } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { FBEditorState, FBSchemaProps, FBWorkspace } from "../../../../ui/form.builder";
import FBMaterialEqInfoContainer from "../../../../ui/form.builder/FBMaterialEquipmentInfo/FBMaterailEqInfo.container";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMTabs } from "../../../Shifamed/Components/SMTabs/SMTabs.hoc";
import FBTrainingInfoContainer from "../DocumentRevisionForm/Components/FBTrainingInfo/FBTrainingInfo.container";
import { withDocumentRevisionFormWrap } from "./DocumentRevisionForm.wrap";

const DocumentRevisionForm: React.FunctionComponent<DocumentRevisionFormProps> = ({
  onTabChange,
  setDocId,
  onDirtyFlagChange,
  onScroll,
  _formState,
  _tabsState,
  _documentRevisionFormState,
  documentRevision,
  bannerPortal,
  shouldShowUpgrade,
  type,
  isDisabled,
  formValues,
  documentRevisions,
  showRevisionTypeChange,
  proposedDocId,
  doNotPrompt,
  documentTypesById,
  canChangeOwnerShip,
  isNewVersion,
  showAdministrativeAndVoidChange,
  pmFormId,
  redlineActive,
  isOutput,
  lastSavedTimestamp,
  email,
  isOwner,
  schema,
  formInput,
  autosaveEnabled,
  mode,
  workspaceState,
  isCreateUrl,
}) => {
  const docTypeGroup = get(documentRevision?.document?.documentType, "group", "OTHER");
  const outputTypeGroup = get(documentRevision?.formTemplate?.outputDocumentTypes[0], "group");
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isLHR = checkIsDocumentLHR(groupOptions);
  const isTypeMpiDoc = checkIsDocumentMPIOutput(groupOptions);
  const smartReferencesFrom = documentRevision?.smartReferencesFrom?.filter((ref) =>
    ref.active && ref.type === SmartReferenceType.HiddenPiInstance &&
      schema.map((el) => el.name).filter((el) => el?.includes(ref.metadata.fieldId)));
  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  let tabConfig = useSelector((state: ApplicationState) => documentTypeSelectors.getTabConfiguration(state, group));

  if (isLHR) {
    schema = (schema || []).map((schemaItem: FBSchemaProps, i, ro) => ({
      ...schemaItem,
      index: i,
      ...(includes(FBEditorState.pickStepIndex, schemaItem.type) && {
        stepIndex: size(
          filter(
            ro.slice(0, i + 1),
            (step) =>
              !step.deleted && includes(FBEditorState.pickStepIndex, step.type)
          )
        ),
      }),
    }));

    smartReferencesFrom?.forEach((ele, i) => {
      const obj = schema.filter((el) => ele?.metadata?.fieldId === el.name);
      ele.stepIndex = obj[0]?.stepIndex;
    });
  }

  if (tabConfig && [DOC_TYPE_GROUP.LHR, DOC_TYPE_GROUP.LHRT, DOC_TYPE_GROUP.ENGINEERING_BUILD, DOC_TYPE_GROUP.PI]
    .includes(group as DOC_TYPE_GROUP)) {
    tabConfig = [ ...tabConfig, {
      labelId: "tabId.materialsandequipment",
      tabId: TabTypeOptions.TABS_MEQ,
      type: TabTypeOptions.TABS_MEQ,
    }];
  }

  if (formValues.values?.retrain) {
    tabConfig = tabConfig && [...tabConfig, {
      labelId: "tabId.training",
      tabId: "training",
      type: "TRAINING",
    } ];
  }

  const tabLabels: string[] = tabConfig?.map((tabInfo) => tabInfo.labelId);
  const trainingTabIndex = tabLabels?.findIndex((tab) => tab === "tabId.training");

  useEffect(() => {
    if (!tabConfig) {
      return;
    }
    _tabsState?.setTabID(tabConfig[_tabsState.value].tabId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabConfig]);

  const getHeight = () => (isCreateUrl && _documentRevisionFormState?.isDesTextClamped) ?
    "calc(100vh - 315px)" : "auto";

  return (
    <SMForm
      templateBoxProps={{ stretchY: "100%", width: "100%" }}
      contentBoxProps={{
        minHeight: "calc(100% - 30%)",
        bgcolor: Colors.alabaster,
      }}
      values={formValues.values}
      leftSidebar={DocumentRevisionLeftPanel}
      header= {
        <DocumentRevisionHeader
          {...{ bannerPortal, shouldShowUpgrade }}
          documentRevisionId={documentRevision?.id}
        />
      }
    >
      <SMTemplate
        boxProps={{ className: "hide-scroll" }}
        templateBoxProps={{ stretchY: "100%" }}
        contentBoxProps={{ stretchY: "100%" }}
        rightSidebarBoxProps={{ zIndex: 2 }}
        {..._documentRevisionFormState?.id && _documentRevisionFormState?.documentRevision && {
          rightSidebar: (
            <Observer>
              {() => <DocumentRevisionSidebar edit={true} />}
            </Observer>
          ),
        }}
      >
        <Observer>
          {() => (
            <SMTemplate
              templateBoxProps={{ stretchY: "100%" }}
              contentBoxProps={{ minHeight: (((!isLHR && !isTypeMpiDoc) || isLHR) ? "20%" : "0px"), height: "auto" }}
              boxProps={{
                overflow: (_documentRevisionFormState?.expanded ? "auto" :
                  (((isCreateUrl && _documentRevisionFormState?.isDescriptionFocused) ||
                    (_documentRevisionFormState?.isDescriptionFocused) || isCreateUrl) ? "auto" : "")),
                height: isCreateUrl ? "calc(100vh - 105px)" :  "calc(100vh - 130px)",
              }}
              header={(!isLHR && !isTypeMpiDoc) && <DocumentRevisionFormHeader
                type={type}
                documentTypeId={formValues.values.document?.documentType?.id}
              />}
              lhrSteps={isLHR && <DocumentRevisionFormProgressBar smartReferencesFrom={smartReferencesFrom} />}
            >
              <Observer>
                {() => (
                  <SMTabs
                    onChange={(ev, newValue) => onTabChange?.(ev, newValue, tabConfig)}
                    tabs={tabLabels}
                    boxProps={{ px: 3.75 }}
                  >
                    {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                      const tabType = tabInfo.type;
                      const showTabContent = _tabsState?.tabID === tabInfo.tabId;
                      return (
                        <SMBox
                          height={
                            (_documentRevisionFormState?.isDescriptionFocused ||
                          isCreateUrl)
                              ? getHeight()
                              : (_documentRevisionFormState?.isDesTextClamped ||
                              _documentRevisionFormState?.isDescriptionFocused)
                                ? "calc(100vh - 310px)"
                                : (isLHR && !documentRevision.changeRequest)
                                  ? "calc(100vh - 256px)"
                                  : "calc(100vh - 307px)"
                          }
                          key={index}
                          pb={(isCreateUrl && _documentRevisionFormState?.isDesTextClamped) ? 0 : 2}
                          overflow={_documentRevisionFormState?.expanded ? "" : "auto"} {...{ onScroll }}>
                          <SMBox>
                            {tabType === "MIXED" && <>
                              <DocumentRevisionFormPresenter
                                {...formValues}
                                releasedDocRev={_documentRevisionFormState?.releasedDocRev}
                                {...{
                                  documentRevisions,
                                  documentRevision,
                                  showRevisionTypeChange,
                                  proposedDocId,
                                  setDocId,
                                  doNotPrompt,
                                  onDirtyFlagChange,
                                  documentTypesById,
                                  canChangeOwnerShip,
                                  type,
                                  isNewVersion,
                                  bannerPortal,
                                  showAdministrativeAndVoidChange,
                                  pmFormId,
                                  redlineActive,
                                  isOutput,
                                  lastSavedTimestamp,
                                  isDisabled,
                                  email,
                                  isOwner,
                                  mode,
                                }}
                              />
                              {documentRevision && showTabContent &&  <FBWorkspace
                                isPortal={false}
                                document={{
                                  ...formValues.values as unknown as DocumentRevision,
                                  ...documentRevision as unknown as DocumentRevision,
                                }}
                                {... { autosaveEnabled, workspaceState }}
                                initialValues={formInput}
                                schema={schema}
                              />}
                            </>}
                            {tabType === "DYNAMIC" && showTabContent && _formState?.mode !== "none" &&  (
                              <FBWorkspace
                                isPortal={false}
                                document={{
                                  ...formValues.values as unknown as DocumentRevision,
                                  ...documentRevision as unknown as DocumentRevision,
                                }}
                                {... { autosaveEnabled, workspaceState }}
                                initialValues={formInput}
                                schema={schema}
                              />
                            )}
                            {tabType === TabTypeOptions.TABS_MEQ &&
                        <FBMaterialEqInfoContainer
                          documentRevisionId={documentRevision?.id}
                        />
                            }
                            {tabType === "TRAINING" &&
                          _tabsState?.value === trainingTabIndex && (
                              <FBTrainingInfoContainer
                                documentRevisionId={documentRevision?.id}
                              />
                            )}
                          </SMBox>
                        </SMBox>
                      );
                    })}
                  </SMTabs>
                )}
              </Observer>
            </SMTemplate>
          )}
        </Observer>
      </SMTemplate>
    </SMForm>
  ); };

export default withSMTabs(withDocumentRevisionFormWrap(DocumentRevisionForm));
