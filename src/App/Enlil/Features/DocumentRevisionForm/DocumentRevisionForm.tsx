import { Box } from "@material-ui/core";
import { filter, get, includes, map, size } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionFormHeader, DocumentRevisionFormProgressBar, DocumentRevisionFormProps, DocumentRevisionHeader, DocumentRevisionLeftPanel, DocumentRevisionSidebar, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupType, DOC_TYPE_GROUP, TabInfo, TabTypeOptions } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, SmartReferenceType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { DocTypeGroups } from "../../../../ui/dashboard.new/line.items/common/types";
import AttachmentsField from "../../../../ui/document.revision/form/attachments";
import { isOperator } from "../../../../ui/documentRevision/DocumentRevisionDisplay.container";
import DocumentRevisionFormPresenter from "../../../../ui/documentRevision/forms/DocumentRevisionForm.presenter";
import LHRBanner from "../../../../ui/documentRevision/forms/presenters/lhr/LHR.banner";
import RedlineBanner from "../../../../ui/documentRevision/forms/presenters/redline/Redline.banner";
import UpgradeToLatestContainer from "../../../../ui/documentRevision/forms/presenters/upgrade.to.latest/UpgradeToLatest.container";
import { checkIsDocumentLHR, checkIsDocumentMPI, checkIsDocumentMPIOutput } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { FBEditorState, FBSchemaProps, FBSection, FBWorkspace, FBWorkspaceModeOptions } from "../../../../ui/form.builder";
import FBMaterialEqInfoContainer from "../../../../ui/form.builder/FBMaterialEquipmentInfo/FBMaterailEqInfo.container";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMTabs } from "../../../Shifamed/Components/SMTabs/SMTabs.hoc";
import FBTrainingInfoContainer from "../DocumentRevisionForm/Components/FBTrainingInfo/FBTrainingInfo.container";
import { withDocumentRevisionFormWrap } from "./DocumentRevisionForm.wrap";

const DocumentRevisionForm: React.FunctionComponent<DocumentRevisionFormProps> = ({
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
  redlineActive,
  isOutput,
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
  const isMPI = checkIsDocumentMPI(groupOptions);
  const isTypeMpiDoc = checkIsDocumentMPIOutput(groupOptions);
  const smartReferencesFrom = documentRevision?.smartReferencesFrom?.filter((ref) =>
    ref.active && ref.type === SmartReferenceType.HiddenPiInstance &&
      schema.map((el) => el.name).filter((el) => el?.includes(ref.metadata.fieldId)));
  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  let tabConfig = useSelector((state: ApplicationState) => documentTypeSelectors.getTabConfiguration(state, group));
  const documentTypeId = formValues.values.document?.documentType?.id || "";
  const docRevId = documentRevision?.id;
  const isAttachmentEmpty = !(documentRevision?.attachments?.length > 1);
  const isCurrentUserOperator = React.useContext(isOperator);
  const isDisabledInput = formValues.values.id !== undefined && isCurrentUserOperator && !isOwner;

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
      tabId: TabTypeOptions.TABS_MEQ.toLowerCase(),
      type: TabTypeOptions.TABS_MEQ,
    }];
  }

  if (formValues.values?.retrain) {
    tabConfig = tabConfig && [...tabConfig, {
      labelId: "tabId.training",
      tabId: TabTypeOptions.TRAINING.toLowerCase(),
      type: TabTypeOptions.TRAINING,
    } ];
  }

  return (
    <SMForm
      templateBoxProps={{ stretchY: "100%", width: "100%" }}
      contentBoxProps={{ bgcolor: Colors.alabaster }}
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
        rightSidebarBoxProps={{ zIndex: 2, marginBottom: 1 }}
        {..._documentRevisionFormState?.id && _documentRevisionFormState?.documentRevision && {
          rightSidebar: (
            <Observer>
              {() => <DocumentRevisionSidebar edit={true} />}
            </Observer>
          ),
        }}
      >
        <RedlineBanner />
        <UpgradeToLatestContainer
          type="banner"
          docRevId={documentRevision?.id}
          {...{
            bannerPortal,
            shouldShowUpgrade,
          }}
        />
        {documentRevision && <LHRBanner documentRevision={documentRevision}/>}
        <Observer>
          {() => (
            <SMTemplate
              templateBoxProps={{ stretchY: "100%" }}
              contentBoxProps={{
                minHeight: _documentRevisionFormState?.expanded ? "unset"
                  :  (isMPI ? "100%" :  (((!isLHR && !isTypeMpiDoc) || isLHR) ? "20%" : "0px" )),
                height: "auto",
              }}
              boxProps={{
                overflow: (_documentRevisionFormState?.expanded ? "auto" :
                  (((isCreateUrl && _documentRevisionFormState?.isDescriptionFocused) ||
                    (_documentRevisionFormState?.isDescriptionFocused) || isCreateUrl) ? "auto" : "")),
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
                    tabs={tabConfig}
                    boxProps={{ px: 3.75, stretchY: "100%", display: "flex", flexDirection: "column" }}
                    panelProps={{ flex: 1 }}
                  >
                    {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                      const tabType = tabInfo.type;
                      const showTabContent = _tabsState?.isTabActive(tabInfo.tabId);

                      return (
                        <SMBox
                          key={index}
                        >
                          {tabType === "MIXED" && (
                            <>
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
                                  redlineActive,
                                  isOutput,
                                  isDisabled,
                                  email,
                                  isOwner,
                                  mode,
                                }}
                              />
                              {documentRevision && showTabContent && (
                                <FBWorkspace
                                  isPortal={false}
                                  document={{
                                    ...documentRevision as unknown as DocumentRevision,
                                    ...formValues.values as unknown as DocumentRevision,
                                  }}
                                  {... { autosaveEnabled, workspaceState }}
                                  initialValues={formInput}
                                  schema={schema}
                                />
                              )}
                            </>
                          )}
                          {tabType === "DYNAMIC" && showTabContent && _formState?.mode !== "none" && (
                            <>
                              {tabInfo.tabId === "lineitems" && (
                                <Box pb={3.75}>
                                  {mode === FBWorkspaceModeOptions.FORM && (
                                    <FBSection
                                      name={`fb-po-section-po-items-built-in`}
                                      label="form.builder.po.details"
                                    />
                                  )}
                                  <AttachmentsField
                                    isDisabled={isDisabledInput}
                                    isNewVersion={false}
                                    docRevId={docRevId}
                                    isAttachmentEmpty={isAttachmentEmpty}
                                    containsRedline={false}
                                    docRevStatus={documentRevision?.status}
                                    documentRevision={documentRevision}
                                    documentTypeId={documentTypeId || ""}
                                    labeld={"Supporting Documents"}
                                  />
                                </Box>
                              )}
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
                            </>
                          )}
                          {tabType === TabTypeOptions.TABS_MEQ && (
                            <FBMaterialEqInfoContainer
                              documentRevision={documentRevision}
                              inView={Boolean(_tabsState?.isTabActive(TabTypeOptions.TABS_MEQ))}
                            />
                          )}
                          {tabType === TabTypeOptions.TRAINING && _tabsState?.isTabActive(TabTypeOptions.TRAINING) && (
                            <FBTrainingInfoContainer
                              documentRevisionId={documentRevision?.id}
                              docRevStatus={documentRevision?.status}
                            />
                          )}
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
