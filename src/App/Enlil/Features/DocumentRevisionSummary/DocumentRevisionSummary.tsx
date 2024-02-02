import { Formik } from 'formik';
import { debounce, filter, get, includes, isEmpty, map, size } from 'lodash';
import { Observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer, AutoSizerProps } from 'react-virtualized';
import { DocumentRevisionFormProgressBar, DocumentRevisionSidebar, DocumentRevisionSummaryHeader, DocumentRevisionSummaryProps, SMBox, SMForm, SMTabs, SMTemplate } from '../../..';
import { documentTypeSelectors } from '../../../../state/ducks/documentRevisions/documentType';
import { DocumentGroupType, DOC_TYPE_GROUP, TabInfo, TabTypeOptions, WorkOrderTypes } from '../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevisionStatus, FBOutputDocumentType, SmartReferenceType } from '../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../state/reducers';
import FBMaterialDisposition from '../../../../ui/change.request/FBMaterialDisposition';
import ItemsAndDetailsWrapper from '../../../../ui/change.request/items.and.details/ItemsAndDetails.wrap';
import { FormContext } from '../../../../ui/components/forms/FormContext';
import { DocTypeGroups } from '../../../../ui/dashboard.new/line.items/common/types';
import SummaryHeader from '../../../../ui/document.revision/header/SummaryHeader';
import Attachment from '../../../../ui/document.revision/summary/attachment';
import SummaryPresenter from '../../../../ui/document.revision/summary/presenter';
import LHRBanner from '../../../../ui/documentRevision/forms/presenters/lhr/LHR.banner';
import { checkIsDocumentChangeRequest, checkIsDocumentForm, checkIsDocumentLHR, checkIsDocumentMPIOutput, checkIsDocumentPart, checkIsDocumentPO, checkIsDocumentWO } from '../../../../ui/documentRevision/helpers/checkDocumentGroup';
import { FBBOM, FBEditorState, FBSchemaProps, FBSection, FBWorkspace, FBWorkspaceModeOptions } from '../../../../ui/form.builder';
import FBAllocationTreeList from '../../../../ui/form.builder/FBAllocation/components/treelist';
import FBMaterialEqInfoContainer from '../../../../ui/form.builder/FBMaterialEquipmentInfo/FBMaterailEqInfo.container';
import Colors from '../../../../ui/layout/theme/utils/colors';
import { withSMForm } from '../../../Shifamed/Components/SMForm/SMForm.hoc';
import { withSMTabs } from '../../../Shifamed/Components/SMTabs/SMTabs.hoc';
import FBTrainingInfoContainer from '../DocumentRevisionForm/Components/FBTrainingInfo/FBTrainingInfo.container';
import { withDocumentRevisionSummaryWrap } from './DocumentRevisionSummary.wrap';

const DocumentRevisionSummary: React.FunctionComponent<DocumentRevisionSummaryProps> = ({
  onScroll,
  _tabsState,
  _documentRevisionFormState,
  documentRevision,
  canChangeOwnerShip,
  schema,
  isFB,
  isSideBarHidden = false,
  isSliderView,
}) => {
  const docTypeGroup = get(documentRevision?.document?.documentType, 'group', 'OTHER');
  const outputTypeGroup = get(documentRevision?.formTemplate?.outputDocumentTypes[0], 'group');
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isLHR = checkIsDocumentLHR(groupOptions);
  const isTypeMpiDoc = checkIsDocumentMPIOutput(groupOptions);
  const isPO = checkIsDocumentPO(documentRevision?.document.documentType.groupOptions);
  const isPartForm = checkIsDocumentPart(
    (documentRevision?.formTemplate?.outputDocumentTypes[0] as FBOutputDocumentType)?.groupOptions);
  const isARForm = checkIsDocumentChangeRequest(
      (documentRevision?.formTemplate?.outputDocumentTypes[0] as FBOutputDocumentType)?.groupOptions);
  const smartReferencesFrom
  = documentRevision?.smartReferencesFrom?.filter(
    (ref) =>
      ref.active
        && ref.type === SmartReferenceType.HiddenPiInstance
        && schema
          ?.map((el) => el.name)
          .filter((el) => el?.includes(ref.metadata.fieldId)),
  );

  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  const isWO = group === DOC_TYPE_GROUP.WORK_ORDER || checkIsDocumentWO(groupOptions);
  let tabConfig = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getTabConfiguration(state, group));
  if (tabConfig && [DOC_TYPE_GROUP.LHR, DOC_TYPE_GROUP.LHRT, DOC_TYPE_GROUP.ENGINEERING_BUILD, DOC_TYPE_GROUP.PI]
    .includes(group as DOC_TYPE_GROUP)) {
    tabConfig = [...tabConfig, {
      labelId: 'tabId.materialsandequipment',
      tabId: TabTypeOptions.TABS_MEQ.toLowerCase(),
      type: TabTypeOptions.TABS_MEQ,
    }];
  }
  if (documentRevision.retrain && tabConfig) {
    tabConfig = [...tabConfig, {
      labelId: 'tabId.training',
      tabId: TabTypeOptions.TRAINING.toLowerCase(),
      type: TabTypeOptions.TRAINING,
    }];
  }

  if (tabConfig && [DOC_TYPE_GROUP.PART]
    .includes(group as DOC_TYPE_GROUP)) {
    tabConfig = tabConfig && [...tabConfig, {
      labelId: 'tabId.bom',
      tabId: TabTypeOptions.BOM.toLowerCase(),
      type: TabTypeOptions.BOM,
    }];
  }

  if (isWO && !documentRevision.formTemplate && documentRevision.formInput?.work_order_type === WorkOrderTypes.OTHER) {
    // hide allocation & BOM Tabs on Work order Other case
    tabConfig = tabConfig.filter(tab => ![TabTypeOptions?.BOM, TabTypeOptions?.ALLOCATION].includes(tab.type as TabTypeOptions));
  }

  const isAttachmentEmpty = !(documentRevision?.attachments?.length > 1);
  const isDownloadAllVisible = (documentRevision?.attachments?.length > 1);
  const onSubmit = () => undefined;

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

    smartReferencesFrom?.forEach((ele) => {
      const obj = schema?.filter((el) => ele.metadata.fieldId === el.name);
      ele.stepIndex = obj?.[0]?.stepIndex;
    });
  }

  const handleResize: AutoSizerProps['onResize'] = useCallback(
    debounce(
      (size) => {
        _tabsState?.setContentSize(size);
      },
      300,
    ),
    [_tabsState],
  );

  if (isARForm && !tabConfig?.find((tab: TabInfo) => tab.labelId === 'tabId.materialDisposition')) {
    tabConfig.splice(2, 0, {
      labelId: 'tabId.materialDisposition',
      tabId: TabTypeOptions.MATERIAL_DISPOSITION.toLowerCase(),
      type: TabTypeOptions.MATERIAL_DISPOSITION,
    });
  }

  return (
    <SMForm
      templateBoxProps={{ stretchY: '100%', width: '100%' }}
      headerBoxProps={{ maxHeight: '30%', minHeight: 76 }}
      contentBoxProps={{ bgcolor: Colors.alabaster }}
      values={documentRevision}
      header= {
        <SummaryHeader
          canShowCreateVersionButton={true}
          {...{ documentRevision, canChangeOwnerShip, isSliderView }}
        />
      }
    >
      <SMTemplate
        boxProps={{ className: 'hide-scroll' }}
        templateBoxProps={{ stretchY: '100%' }}
        contentBoxProps={{ stretchY: '100%' }}
        rightSidebarBoxProps={{ zIndex: 2, marginBottom: 1 }}
        {..._documentRevisionFormState?.documentRevision && !isSideBarHidden && {
          rightSidebar: (
            <Observer>
              {() => (
                <DocumentRevisionSidebar isSliderView={isSliderView} />
              )}
            </Observer>
          ),
        }}
      >
        {documentRevision && <LHRBanner documentRevision={documentRevision} />}
        <Observer>
          {() => (
            <SMTemplate
              templateBoxProps={{ stretchY: '100%' }}
              contentBoxProps={{
                overflow: _documentRevisionFormState?.expanded ? 'unset' : 'auto',
              }}
              header={(!isLHR && !isTypeMpiDoc) && <DocumentRevisionSummaryHeader {...{ documentRevision }} isSliderView={isSliderView} />}
              lhrSteps={isLHR && <DocumentRevisionFormProgressBar smartReferencesFrom={smartReferencesFrom} />}
            >
              <Observer>
                {() => (
                  <SMTabs
                    tabs={tabConfig}
                    boxProps={{ px: 3.75, stretchY: '100%', display: 'flex', flexDirection: 'column' }}
                    panelProps={{ flex: 1 }}
                  >
                    {map(tabConfig, (tabInfo: TabInfo) => {
                      const tabType = tabInfo.type;
                      const { tabId } = tabInfo || {};
                      const availableSchema = schema?.filter((schemaItem) =>
                        schemaItem.tabId === tabId && !schemaItem.deleted);

                      return (
                        <AutoSizer onResize={handleResize}>
                          {({ width }) => (
                            <SMBox style={{ width }} pb={2} onScroll={onScroll} id="Presenter-FBWorkspace">
                              {tabType === TabTypeOptions.MIXED && <>
                                <SummaryPresenter
                                  dataProp={documentRevision}
                                  canChangeOwnerShip={canChangeOwnerShip}
                                  canShowCreateVersionButton={true}
                                />
                                {!isEmpty(availableSchema) && <FBWorkspace
                                  document={documentRevision}
                                  initialValues={documentRevision.formInput}
                                  schema={schema}
                                  mode={checkIsDocumentForm(documentRevision?.document.documentType.groupOptions)
                                    ? FBWorkspaceModeOptions.FORMPREVIEW : FBWorkspaceModeOptions.PREVIEW}
                                />
                                }
                              </>}
                              {tabType === TabTypeOptions.DYNAMIC && isFB && (
                                <>
                                  {tabInfo.tabId === 'lineitems' && (
                                    <FormContext.Provider
                                      value={{ submitOnChange: false }}>
                                      <Formik
                                        initialValues={{ attachments: documentRevision?.attachments }}
                                        onSubmit={onSubmit}
                                        enableReinitialize={true}
                                      >
                                        <>
                                          <FBSection name="fb-po-section-po-items-built-in"
                                            label="form.builder.po.details" />
                                          <Attachment
                                            isAttachmentEmpty={isAttachmentEmpty}
                                            docRevId={documentRevision.id}
                                            containsRedline={false}
                                            label="Supporting Documents"
                                            docRevStatus={documentRevision.status}
                                            {...{ isDownloadAllVisible }}
                                          />
                                        </>
                                      </Formik>
                                    </FormContext.Provider>
                                  )}
                                  <FBWorkspace
                                    document={documentRevision}
                                    initialValues={documentRevision.formInput}
                                    schema={schema}
                                    mode={checkIsDocumentForm(documentRevision?.document.documentType.groupOptions)
                                      ? FBWorkspaceModeOptions.FORMPREVIEW : FBWorkspaceModeOptions.PREVIEW}
                                  />
                                </>
                              )}
                              {tabType === TabTypeOptions.TABS_MEQ
                          && !isPO && documentRevision.status !== DocumentRevisionStatus.Voided
                          && <FBMaterialEqInfoContainer
                            documentRevision={documentRevision}
                            inView={Boolean(_tabsState?.isTabActive(TabTypeOptions.TABS_MEQ))}
                          />
                              }
                              {tabType === TabTypeOptions.TRAINING && _tabsState?.isTabActive(TabTypeOptions.TRAINING) && (
                                <FBTrainingInfoContainer
                                  documentRevisionId={documentRevision?.id}
                                  docRevStatus={documentRevision.status}
                                />
                              )}
                              {tabType === TabTypeOptions.BOM && _tabsState?.isTabActive(TabTypeOptions.BOM) && (
                                <FBBOM documentRevision={documentRevision} isDisabled={true} isShowOnly={isPartForm || (isWO && !isEmpty(documentRevision?.formTemplate))}
                                  isUpgradeDisabled={true} isWO={isWO}
                                />
                              )}
                              {tabType === TabTypeOptions.ALLOCATION && _tabsState?.isTabActive(TabTypeOptions.ALLOCATION) && (
                                <FBAllocationTreeList documentRevision={documentRevision} isDisabled={true} />)}
                              {tabType === TabTypeOptions.MATERIAL_DISPOSITION
                                && _tabsState?.isTabActive(
                                  TabTypeOptions.MATERIAL_DISPOSITION,
                                ) && (
                                <FBMaterialDisposition isShowOnly={true} />
                              )}
                              {tabType === TabTypeOptions.ITEMS && (
                                <ItemsAndDetailsWrapper
                                  currentDocRevId={documentRevision?.id}
                                  initialValues={documentRevision.formInput ?? {}}
                                  mode={FBWorkspaceModeOptions.PREVIEW}
                                />
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
  );
};

export default withSMForm(withSMTabs(withDocumentRevisionSummaryWrap(DocumentRevisionSummary)));
