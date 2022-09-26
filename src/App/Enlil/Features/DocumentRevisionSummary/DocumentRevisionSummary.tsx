import { Formik } from "formik";
import { filter, get, includes, isEmpty, map, size } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionFormProgressBar, DocumentRevisionSidebar, DocumentRevisionSummaryHeader, DocumentRevisionSummaryProps, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupType, DOC_TYPE_GROUP, TabInfo, TabTypeOptions } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionStatus, SmartReferenceType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { FormContext } from "../../../../ui/components/forms/FormContext";
import { DocTypeGroups } from "../../../../ui/dashboard.new/line.items/common/types";
import SummaryHeader from "../../../../ui/document.revision/header/SummaryHeader";
import Attachment from "../../../../ui/document.revision/summary/attachment";
import SummaryPresenter from "../../../../ui/document.revision/summary/presenter";
import { checkIsDocumentForm, checkIsDocumentLHR, checkIsDocumentMPIOutput } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { FBEditorState, FBSchemaProps, FBSection, FBWorkspace, FBWorkspaceModeOptions } from "../../../../ui/form.builder";
import FBMaterialEqInfoContainer from "../../../../ui/form.builder/FBMaterialEquipmentInfo/FBMaterailEqInfo.container";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMForm } from "../../../Shifamed/Components/SMForm/SMForm.hoc";
import { withSMTabs } from "../../../Shifamed/Components/SMTabs/SMTabs.hoc";
import FBTrainingInfoContainer from "../DocumentRevisionForm/Components/FBTrainingInfo/FBTrainingInfo.container";
import { withDocumentRevisionSummaryWrap } from "./DocumentRevisionSummary.wrap";

const DocumentRevisionSummary: React.FunctionComponent<DocumentRevisionSummaryProps> = ({
  onScroll,
  _tabsState,
  _documentRevisionFormState,
  documentRevision,
  canChangeOwnerShip,
  schema,
  isFB,
}) => {
  const docTypeGroup = get(documentRevision?.document?.documentType, "group", "OTHER");
  const outputTypeGroup = get(documentRevision?.formTemplate?.outputDocumentTypes[0], "group");
  const groupOptions = documentRevision?.document.documentType.groupOptions;
  const isLHR = checkIsDocumentLHR(groupOptions);
  const isTypeMpiDoc = checkIsDocumentMPIOutput(groupOptions);
  const smartReferencesFrom =
  documentRevision?.smartReferencesFrom?.filter(
      (ref) =>
        ref.active &&
        ref.type === SmartReferenceType.HiddenPiInstance &&
        schema
          ?.map((el) => el.name)
          .filter((el) => el?.includes(ref.metadata.fieldId))
    );

  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  let tabConfig = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getTabConfiguration(state, group));
  if (tabConfig &&  [DOC_TYPE_GROUP.LHR, DOC_TYPE_GROUP.LHRT, DOC_TYPE_GROUP.ENGINEERING_BUILD, DOC_TYPE_GROUP.PI]
    .includes(group as DOC_TYPE_GROUP)) {
    tabConfig = [ ...tabConfig, {
      labelId: "tabId.materialsandequipment",
      tabId: TabTypeOptions.TABS_MEQ.toLowerCase(),
      type: TabTypeOptions.TABS_MEQ,
    }];
  }
  if (documentRevision.retrain && tabConfig) {
    tabConfig = [...tabConfig, {
      labelId: "tabId.training",
      tabId: TabTypeOptions.TRAINING.toLowerCase(),
      type: TabTypeOptions.TRAINING,
    }];
  }

  const tabIds = tabConfig?.map(({ tabId }) => tabId);
  const isAttachmentEmpty = !(documentRevision?.attachments?.length > 1);
  const onSubmit = () => void 0;

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

    smartReferencesFrom?.forEach((ele) => {
      const obj = schema?.filter((el) => ele.metadata.fieldId === el.name);
      ele.stepIndex = obj?.[0]?.stepIndex;
    });
  }

  return (
    <SMForm
      templateBoxProps={{ stretchY: "100%" }}
      headerBoxProps={{ maxHeight: "30%", minHeight: 84 }}
      contentBoxProps={{
        minHeight: "calc(70%)", height: "100%",
        bgcolor: Colors.alabaster,
      }}
      values={documentRevision}
      header= {
        <SummaryHeader
          canShowCreateVersionButton={true}
          {...{ documentRevision, canChangeOwnerShip }}
        />
      }
    >
      <SMTemplate
        boxProps={{ className: "hide-scroll" }}
        templateBoxProps={{ stretchY: "100%" }}
        contentBoxProps={{ stretchY: "100%" }}
        rightSidebarBoxProps={{ zIndex: 2 }}
        {..._documentRevisionFormState?.documentRevision && {
          rightSidebar: (
            <Observer>
              {() => <DocumentRevisionSidebar edit={false} />}
            </Observer>
          ),
        }}
      >
        <Observer>
          {() => (
            <SMTemplate
              templateBoxProps={{ stretchY: "100%", overflow: "auto" }}
              header={(!isLHR && !isTypeMpiDoc) && <DocumentRevisionSummaryHeader {...{ documentRevision }} />}
              lhrSteps={isLHR && <DocumentRevisionFormProgressBar smartReferencesFrom={smartReferencesFrom} />}
            >
              <Observer>
                {() => (
                  <SMTabs tabs={tabIds} boxProps={{ px: 4.25 }}>
                    {map(tabConfig, (tabInfo: TabInfo) => {
                      const tabType = tabInfo.type;
                      const { tabId } = tabInfo || {};
                      const tabSchema = schema?.filter((schemaItem) => schemaItem.tabId === tabId);
                      const availableSchema = schema?.filter((schemaItem) =>
                        schemaItem.tabId === tabId && !schemaItem.deleted);

                      return (
                        <SMBox onScroll={onScroll} id="Presenter-FBWorkspace">
                          {tabType === TabTypeOptions.MIXED &&  <>
                            <SummaryPresenter
                              dataProp={documentRevision}
                              canChangeOwnerShip={canChangeOwnerShip}
                              canShowCreateVersionButton={true}
                            />
                            {!isEmpty(availableSchema) && <FBWorkspace
                              document={documentRevision}
                              initialValues={documentRevision.formInput}
                              schema={tabSchema}
                              mode={checkIsDocumentForm(documentRevision?.document.documentType.groupOptions) ?
                                FBWorkspaceModeOptions.FORMPREVIEW : FBWorkspaceModeOptions.PREVIEW}
                            />
                            }
                          </>}
                          {tabType === TabTypeOptions.DYNAMIC && isFB && (
                            <>
                              {tabInfo.tabId === "lineitems" && (
                                <FormContext.Provider
                                  value={{ submitOnChange: false }}>
                                  <Formik
                                    initialValues={{ attachments: documentRevision?.attachments }}
                                    onSubmit={onSubmit}
                                    enableReinitialize={true}
                                  >
                                    <>
                                      <FBSection name={`fb-po-section-po-items-built-in`}
                                        label="form.builder.po.details" />
                                      <Attachment
                                        isAttachmentEmpty={isAttachmentEmpty}
                                        docRevId={documentRevision.id}
                                        containsRedline={false}
                                        label={"Supporting Documents"}
                                        docRevStatus={documentRevision.status}
                                      />
                                    </>
                                  </Formik>
                                </FormContext.Provider>
                              )}
                              <FBWorkspace
                                document={documentRevision}
                                initialValues={documentRevision.formInput}
                                schema={tabSchema}
                                mode={checkIsDocumentForm(documentRevision?.document.documentType.groupOptions) ?
                                  FBWorkspaceModeOptions.FORMPREVIEW : FBWorkspaceModeOptions.PREVIEW}
                              />
                            </>
                          )}
                          {tabType === TabTypeOptions.TABS_MEQ &&
                          documentRevision.status !== DocumentRevisionStatus.Voided &&
                          <FBMaterialEqInfoContainer
                            documentRevision={documentRevision}
                            inView={Boolean(_tabsState?.isTabActive(TabTypeOptions.TABS_MEQ))}
                          />
                          }
                          {tabType === TabTypeOptions.TRAINING && _tabsState?.isTabActive(TabTypeOptions.TRAINING) && (
                            <FBTrainingInfoContainer
                              documentRevisionId={documentRevision?.id}
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

export default withSMForm(withSMTabs(withDocumentRevisionSummaryWrap(DocumentRevisionSummary)));
