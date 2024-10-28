import { Box } from '@material-ui/core';
import { debounce, filter, get, includes, isEmpty, map, size } from 'lodash';
import { Observer, useObserver } from 'mobx-react';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer, AutoSizerProps } from 'react-virtualized';
import { DocumentRevisionFormHeader, DocumentRevisionFormProgressBar, DocumentRevisionFormProps, DocumentRevisionHeader, DocumentRevisionLeftPanel, DocumentRevisionSidebar, SM, SMBox, SMForm, SMTabs, SMTemplate } from '../../..';
import { getHasPermission } from '../../../../common/utils/selectors';
import { clearPOSavedInfo, getPOSavedInfo } from '../../../../indexDb';
import { GroupTag, Permission } from '../../../../state/ducks/auth/types';
import { documentTypeSelectors } from '../../../../state/ducks/documentRevisions/documentType';
import { DOC_TYPE_GROUP, DocumentGroupType, TabInfo, TabTypeOptions, WorkOrderTypes } from '../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, FBOutputDocumentType, SmartReferenceType } from '../../../../state/ducks/documentRevisions/types';
import { RELATED_PARTS_STATUS } from '../../../../state/ducks/relatedParts/types';
import { ApplicationState } from '../../../../state/reducers';
import SyncMessageDialogContainer from '../../../../ui/administration/general.settings/panels/ApprovalRoles/components/SyncMessageDialog.container';
import FBMaterialDisposition from '../../../../ui/change.request/FBMaterialDisposition';
import ItemsAndDetailsWrapper from '../../../../ui/change.request/items.and.details/ItemsAndDetails.wrap';
import PromptIfDirty from '../../../../ui/components/forms/PromptIfDirty';
import { DocTypeGroups } from '../../../../ui/dashboard.new/line.items/common/types';
import AttachmentsField from '../../../../ui/document.revision/form/attachments';
import { disableOtherFieldsChangeControl, referencesDisabledChangeControl } from '../../../../ui/document.revision/utils/helpers';
import { isOperator } from '../../../../ui/documentRevision/DocumentRevisionDisplay.container';
import DocumentRevisionFormPresenter from '../../../../ui/documentRevision/forms/DocumentRevisionForm.presenter';
import LHRBanner from '../../../../ui/documentRevision/forms/presenters/lhr/LHR.banner';
import RedlineBanner from '../../../../ui/documentRevision/forms/presenters/redline/Redline.banner';
import UpgradeToLatestContainer from '../../../../ui/documentRevision/forms/presenters/upgrade.to.latest/UpgradeToLatest.container';
import { checkIsDocumentChangeRequest, checkIsDocumentDAM, checkIsDocumentLHR, checkIsDocumentMPIOutput, checkIsDocumentPart, checkIsDocumentPO, checkIsDocumentWOByGroupOrOptions } from '../../../../ui/documentRevision/helpers/checkDocumentGroup';
import { isDocumentRevisionHasOutput } from '../../../../ui/documentRevision/helpers/documentRevisionStatus';
import { FBBOM, FBEditorState, FBSchemaProps, FBSection, FBWorkspace, FBWorkspaceModeOptions } from '../../../../ui/form.builder';
import FBAllocationTreeList from '../../../../ui/form.builder/FBAllocation/components/treelist';
import FBLHRSummary from '../../../../ui/form.builder/FBLHRSummary';
import FBMaterialEqInfoContainer from '../../../../ui/form.builder/FBMaterialEquipmentInfo/FBMaterailEqInfo.container';
import FBDataStore from '../../../../ui/form.builder/FBStore/FBDataStore';
import useGetHasTag from '../../../../ui/hooks/useGetHasTag';
import Colors from '../../../../ui/layout/theme/utils/colors';
import { withSMTabs } from '../../../Shifamed/Components/SMTabs/SMTabs.hoc';
import FBTrainingInfoContainer from '../DocumentRevisionForm/Components/FBTrainingInfo/FBTrainingInfo.container';
import { withDocumentRevisionFormWrap } from './DocumentRevisionForm.wrap';

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
  shouldShowSyncForRelatedEquipment,
  type,
  isDisabled,
  formValues,
  documentRevisions,
  showRevisionTypeChange,
  proposedDocId,
  doNotPrompt,
  setDoNotPrompt,
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
  isSliderView,
  dirty = false,
  inDialog,
}) => {
  const docTypeGroup = get(documentRevision?.document?.documentType, 'group', 'OTHER');
  const outputTypeGroup = get(documentRevision?.formTemplate?.outputDocumentTypes[0], 'group');
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isLHR = checkIsDocumentLHR(groupOptions);
  const isDAM = checkIsDocumentDAM(groupOptions);
  const isPO = checkIsDocumentPO(groupOptions);
  const isPart = checkIsDocumentPart(groupOptions);
  const isPartForm = checkIsDocumentPart(
    (documentRevision?.formTemplate?.outputDocumentTypes[0] as FBOutputDocumentType)?.groupOptions);
  const isARForm = checkIsDocumentChangeRequest(
    (documentRevision?.formTemplate?.outputDocumentTypes[0] as FBOutputDocumentType)?.groupOptions);
  const isTypeMpiDoc = checkIsDocumentMPIOutput(groupOptions);
  const smartReferencesFrom = documentRevision?.smartReferencesFrom?.filter((ref) =>
    ref.active && ref.type === SmartReferenceType.HiddenPiInstance
    && schema.map((el) => el.name).filter((el) => el?.includes(ref.metadata.fieldId)));
  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  const isWO = checkIsDocumentWOByGroupOrOptions(group, groupOptions);
  let tabConfig = useSelector((state: ApplicationState) => documentTypeSelectors.getTabConfiguration(state, group));
  const documentTypeId = formValues.values.document?.documentType?.id || '';
  const docRevId = documentRevision?.id;
  const isAttachmentEmpty = !(documentRevision?.attachments?.length > 1);
  const isCurrentUserOperator = React.useContext(isOperator);
  const isDisabledInput = formValues.values.id !== undefined && isCurrentUserOperator && !isOwner && !documentRevision.isBeingEditedAfterRelease;
  const isUserAdminEnforce = useGetHasTag(GroupTag.PO_ADMIN);
  const hasOutput = isDocumentRevisionHasOutput(documentRevision);
  const isPOEditState = isUserAdminEnforce && SM.isNewVersion && isPO && hasOutput;
  const inRestrictedEditMode = disableOtherFieldsChangeControl(documentRevision);
  const hasPermissionToEditBOM = useSelector(getHasPermission(Permission.EDIT_BOM));

  const isRelatedTogetherPart = documentRevision?.relatedPartsStatus === RELATED_PARTS_STATUS.RELATED_TOGETHER;
  const isBomDisabled = isDisabledInput || inRestrictedEditMode || isPartForm || !hasPermissionToEditBOM || isRelatedTogetherPart;

  if (isLHR) {
    schema = (schema || []).map((schemaItem: FBSchemaProps, i, ro) => ({
      ...schemaItem,
      index: i,
      ...(includes(FBEditorState.pickStepIndex, schemaItem.type) && {
        stepIndex: size(
          filter(
            ro.slice(0, i + 1),
            (step) =>
              !step.deleted && includes(FBEditorState.pickStepIndex, step.type),
          ),
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
    tabConfig = [...tabConfig, {
      labelId: 'tabId.materialsandequipment',
      tabId: TabTypeOptions.TABS_MEQ.toLowerCase(),
      type: TabTypeOptions.TABS_MEQ,
    }];
  }

  if (formValues.values?.retrain) {
    tabConfig = tabConfig && [...tabConfig, {
      labelId: 'tabId.training',
      tabId: TabTypeOptions.TRAINING.toLowerCase(),
      type: TabTypeOptions.TRAINING,
    }];
  }

  if (tabConfig && [DOC_TYPE_GROUP.PART]
    .includes(group as DOC_TYPE_GROUP)) {
    tabConfig = [...tabConfig, {
      labelId: 'tabId.bom',
      tabId: TabTypeOptions.BOM.toLowerCase(),
      type: TabTypeOptions.BOM,
    }];
  }

  if (tabConfig && [DOC_TYPE_GROUP.PAPER_LHR]
    .includes(group as DOC_TYPE_GROUP)) {
    tabConfig = [...tabConfig, {
      labelId: 'tabId.summary',
      tabId: TabTypeOptions.SUMMARY.toLowerCase(),
      type: TabTypeOptions.SUMMARY,
    }];
  }

  if (isARForm && !tabConfig?.find((tab: TabInfo) => tab.labelId === 'tabId.materialDisposition')) {
    tabConfig.splice(2, 0, {
      labelId: 'tabId.materialDisposition',
      tabId: TabTypeOptions.MATERIAL_DISPOSITION.toLowerCase(),
      type: TabTypeOptions.MATERIAL_DISPOSITION,
    });
  }

  useObserver(() => {
    if (formValues.values.id || formValues.values.document?.documentType?.id) {
      dirty = _documentRevisionFormState?.isDirty || false;
    }
  });

  if (isWO && !documentRevision.formTemplate && formValues.values.formInput?.work_order_type === WorkOrderTypes.OTHER) {
    // hide allocation & BOM Tabs on Work order Other case
    tabConfig = tabConfig.filter(tab => ![TabTypeOptions.BOM, TabTypeOptions.ALLOCATION].includes(tab.type as TabTypeOptions));
  }

  const handleResize: AutoSizerProps['onResize'] = useCallback(
    debounce(
      (size) => {
        _tabsState?.setContentSize(size);
      },
      400,
    ),
    [_tabsState],
  );

  return (
    <>
      <SMForm
        templateBoxProps={{ stretchY: '100%', width: '100%' }}
        contentBoxProps={{ bgcolor: Colors.alabaster }}
        values={formValues.values}
        leftSidebar={DocumentRevisionLeftPanel}
        header={
          <DocumentRevisionHeader
            {...{ bannerPortal, shouldShowUpgrade, setDoNotPrompt }}
            documentRevisionId={documentRevision?.id}
            isSliderView={isSliderView}
            inDialog={inDialog}
          />
        }
      >
        <PromptIfDirty
          dirty={dirty}
          doNotPrompt={doNotPrompt}
          onDirtyFlagChange={onDirtyFlagChange}
          onConfirm={async () => {
            setDoNotPrompt?.(true);
            if (isPOEditState) {
              const prevPODoc = await getPOSavedInfo();

              if (!prevPODoc.length) {
                return;
              }

              await workspaceState?.undoPO(prevPODoc[0]);
              await clearPOSavedInfo();
              FBDataStore.setRefreshData(undefined);
            }
          }}
          isDialog={isPOEditState}
          message={isPOEditState ? 'common.navigate.away.po.prompt' : undefined}
        />
        <SMTemplate
          boxProps={{ className: 'hide-scroll' }}
          templateBoxProps={{ stretchY: '100%' }}
          contentBoxProps={{ stretchY: '100%' }}
          rightSidebarBoxProps={{ zIndex: 2, marginBottom: 1 }}
          {..._documentRevisionFormState?.id && _documentRevisionFormState?.documentRevision && {
            rightSidebar: (
              <Observer>
                {() => (
                  <DocumentRevisionSidebar
                    canEdit={isPart ? !referencesDisabledChangeControl(documentRevision) : true}
                    isSliderView={isSliderView}
                    tabConfig={tabConfig}
                  />
                )}
              </Observer>
            ),
          }}
        >
          <Observer>
            {() => (
              <SMTemplate
                templateBoxProps={{ stretchY: '100%' }}
                contentBoxProps={{
                  overflow: _documentRevisionFormState?.expanded ? 'unset' : 'auto',
                }}
                banner={
                  <>
                    <RedlineBanner />
                    <UpgradeToLatestContainer
                      type="banner"
                      docRevId={documentRevision?.id}
                      {...{
                        documentRevision,
                        bannerPortal,
                        shouldShowUpgrade,
                        shouldShowSyncForRelatedEquipment,
                      }}
                    />
                    {documentRevision && <LHRBanner documentRevision={documentRevision} />}
                  </>
                }
                header={(!isLHR && !isTypeMpiDoc) && <DocumentRevisionFormHeader
                  type={type}
                  inRestrictedEditMode={inRestrictedEditMode}
                  documentTypeId={formValues.values.document?.documentType?.id}
                  inDialog={inDialog}
                />}
                lhrSteps={isLHR && <DocumentRevisionFormProgressBar smartReferencesFrom={smartReferencesFrom} />}
              >
                <Observer>
                  {() => (
                    <SMTabs
                      tabs={tabConfig}
                      boxProps={{ px: 3.75, stretchY: '100%', display: 'flex', flexDirection: 'column' }}
                      panelProps={{ flex: 1 }}
                      isCreateUrl={isCreateUrl}
                    >
                      {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                        const tabType = tabInfo.type;
                        const showTabContent = _tabsState?.isTabActive(tabInfo.tabId);

                        return (
                          <AutoSizer onResize={handleResize}>
                            {({ width }) => (
                              <SMBox key={index} style={{ width }} pb={2}>
                                {tabType === 'MIXED' && (
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
                                {tabType === 'DYNAMIC' && showTabContent && _formState?.mode !== 'none' && (
                                  <>
                                    {tabInfo.tabId === 'lineitems' && (
                                      <Box pb={3.75}>
                                        <FBSection
                                          name="fb-po-section-po-items-built-in"
                                          label="form.builder.po.details"
                                        />
                                        <AttachmentsField
                                          isDisabled={isDisabledInput}
                                          isNewVersion={false}
                                          docRevId={docRevId}
                                          isAttachmentEmpty={isAttachmentEmpty}
                                          containsRedline={false}
                                          docRevStatus={documentRevision?.status}
                                          documentRevision={documentRevision}
                                          documentTypeId={documentTypeId || ''}
                                          labeld="Supporting Documents"
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
                                {tabType === TabTypeOptions.BOM && _tabsState?.isTabActive(TabTypeOptions.BOM) && (
                                  <FBBOM documentRevision={documentRevision} isDisabled={isBomDisabled || isWO} isShowOnly={isPartForm || (isWO && !isEmpty(documentRevision?.formTemplate))}
                                    isUpgradeDisabled={isRelatedTogetherPart} isSliderView={isSliderView} isWO={isWO}
                                  />
                                )}
                                {tabType === TabTypeOptions.SUMMARY && _tabsState?.isTabActive(TabTypeOptions.SUMMARY) && (
                                  <FBLHRSummary isShowOnly={!hasOutput} isDisabled={isDisabledInput} />
                                )}
                                {tabType === TabTypeOptions.ALLOCATION && _tabsState?.isTabActive(TabTypeOptions.ALLOCATION) && (
                                  <FBAllocationTreeList documentRevision={documentRevision} isDisabled={isWO && !isEmpty(documentRevision?.formTemplate)} />
                                )}
                                {tabType === TabTypeOptions.ITEMS && (
                                  <ItemsAndDetailsWrapper
                                    currentDocRevId={documentRevision?.id}
                                    initialValues={formInput ?? {}}
                                    autosave={autosaveEnabled}
                                    mode={FBWorkspaceModeOptions.PREVIEW}
                                  />
                                )}
                                {tabType
                                  === TabTypeOptions.MATERIAL_DISPOSITION
                                  && _tabsState?.isTabActive(
                                    TabTypeOptions.MATERIAL_DISPOSITION,
                                  ) && (
                                  <FBMaterialDisposition isShowOnly={true} />
                                )}
                              </SMBox>
                            )}
                          </AutoSizer>
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
      {isDAM && <SyncMessageDialogContainer documentRevision={documentRevision} />}
    </>
  );
};

export default withSMTabs(withDocumentRevisionFormWrap(DocumentRevisionForm));
