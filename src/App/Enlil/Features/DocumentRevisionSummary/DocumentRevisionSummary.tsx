import { filter, get, includes, isEmpty, map, size } from "lodash";
import { Observer } from "mobx-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionFormProgressBar, DocumentRevisionSidebar, DocumentRevisionSummaryHeader, DocumentRevisionSummaryProps, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupType, DOC_TYPE_GROUP, TabInfo, TabTypeOptions } from "../../../../state/ducks/documentRevisions/documentType/types";
import { SmartReferenceType } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { DocTypeGroups } from "../../../../ui/dashboard.new/line.items/common/types";
import SummaryHeader from "../../../../ui/document.revision/header/SummaryHeader";
import SummaryPresenter from "../../../../ui/document.revision/summary/presenter";
import { checkIsDocumentForm, checkIsDocumentLHR, checkIsDocumentMPIOutput } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { FBEditorState, FBSchemaProps, FBWorkspace } from "../../../../ui/form.builder";
import FBMaterialEqInfoContainer from "../../../../ui/form.builder/FBMaterialEquipmentInfo/FBMaterailEqInfo.container";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMForm } from "../../../Shifamed/Components/SMForm/SMForm.hoc";
import { withSMTabs } from "../../../Shifamed/Components/SMTabs/SMTabs.hoc";
import FBTrainingInfoContainer from "../DocumentRevisionForm/Components/FBTrainingInfo/FBTrainingInfo.container";
import { withDocumentRevisionSummaryWrap } from "./DocumentRevisionSummary.wrap";

const DocumentRevisionSummary: React.FunctionComponent<DocumentRevisionSummaryProps> = ({
  onTabChange,
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
  if (documentRevision.retrain && tabConfig) {
    tabConfig = [...tabConfig, {
      labelId: "tabId.training",
      tabId: "training",
      type: "TRAINING",
    }];
  }
  if (tabConfig &&  [DOC_TYPE_GROUP.LHR, DOC_TYPE_GROUP.LHRT].includes(group as DOC_TYPE_GROUP)) {
    tabConfig = [ ...tabConfig, {
      labelId: "tabId.materialsandequipment",
      tabId: TabTypeOptions.TABS_MEQ,
      type: TabTypeOptions.TABS_MEQ,
    }];
  }
  const tabLabels: string[] = tabConfig?.map((tabInfo) => tabInfo.labelId);
  const trainingTabIndex = tabLabels?.findIndex((tab) => tab === "tabId.training");

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
      const obj = schema?.filter((el) => ele.metadata.fieldId === el.name);
      ele.stepIndex = obj?.[0]?.stepIndex;
    });
  }

  useEffect(() => {
    if (!tabConfig) {
      return;
    }
    _tabsState?.setTabID(tabConfig[_tabsState.value].tabId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabConfig]);

  return (
    <SMForm
      templateBoxProps={{ stretchY: "100%" }}
      headerBoxProps={{ maxHeight: "30%" }}
      contentBoxProps={{ minHeight: "calc(100% - 30%)", height: "100%", bgcolor: Colors.alabaster }}
      values={documentRevision}
      header= {
        <SummaryHeader
          canShowCreateVersionButton={true}
          {...{ documentRevision, canChangeOwnerShip }}
        />
      }
    >
      <SMTemplate
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
              templateBoxProps={{ stretchY: "100%" }}
              contentBoxProps={{ minHeight: (((!isLHR && !isTypeMpiDoc) || isLHR) ? "20%" : "0px"), height: "auto" }}
              boxProps={{
                overflow: (_documentRevisionFormState?.expanded ? "auto" : ""),
                height: "calc(100vh - 130px)",
              }}
              header={(!isLHR && !isTypeMpiDoc) && <DocumentRevisionSummaryHeader {...{ documentRevision }} />}
              lhrSteps={isLHR && <DocumentRevisionFormProgressBar smartReferencesFrom={smartReferencesFrom} />}
            >
              <Observer>
                {() => (
                  <SMTabs
                    onChange={(ev, newValue) => onTabChange?.(ev, newValue, tabConfig)}
                    tabs={tabLabels}
                    boxProps={{ px: 4.25 }}
                  >
                    {map(tabConfig, (tabInfo: TabInfo) => {
                      const tabType = tabInfo.type;
                      const { tabId } = tabInfo || {};
                      const tabSchema = schema?.filter((schemaItem) => schemaItem.tabId === tabId);
                      const availableSchema = schema?.filter((schemaItem) =>
                        schemaItem.tabId === tabId && !schemaItem.deleted);

                      return (
                        <SMBox
                          pb={_documentRevisionFormState?.isDesTextClamped ? 0 :
                            (isLHR && !documentRevision.changeRequest ? 0 : 2.5)}
                          height={_documentRevisionFormState?.expanded ? "auto" :
                            (_documentRevisionFormState?.isDesTextClamped ? "calc(100vh - 325px)" :
                              (!documentRevision.changeRequest ? (isLHR &&
                                !_documentRevisionFormState?.isLHRProgressBarVisible ?
                                "calc(100vh - 203px)" : "calc(100vh - 255px)") : "calc(100vh - 280px)"))}
                          overflow="auto" {...{ onScroll }}>
                          <SMBox>
                            {tabType === "MIXED" &&  <>
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
                                  "formPreview" : "preview"}
                              />
                              }
                            </>}
                            {tabType === "DYNAMIC" && isFB && (
                              <FBWorkspace
                                document={documentRevision}
                                initialValues={documentRevision.formInput}
                                schema={tabSchema}
                                mode={checkIsDocumentForm(documentRevision?.document.documentType.groupOptions) ?
                                  "formPreview" : "preview"}
                              />
                            )}
                            {tabType === "TRAINING" &&
                                _tabsState?.value === trainingTabIndex && (
                              <FBTrainingInfoContainer
                                documentRevisionId={documentRevision?.id}
                              />
                            )}
                            {tabType === TabTypeOptions.TABS_MEQ &&
                              <FBMaterialEqInfoContainer
                                documentRevisionId={documentRevision?.id}
                              />
                            }
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

export default withSMForm(withSMTabs(withDocumentRevisionSummaryWrap(DocumentRevisionSummary)));
