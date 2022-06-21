import { get, isEmpty, map } from "lodash";
import { Observer } from "mobx-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionSidebar, DocumentRevisionSummaryHeader, DocumentRevisionSummaryProps, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupType, DOC_TYPE_GROUP, TabInfo, TabTypeOptions } from "../../../../state/ducks/documentRevisions/documentType/types";
import { ApplicationState } from "../../../../state/reducers";
import { DocTypeGroups } from "../../../../ui/dashboard.new/line.items/common/types";
import SummaryHeader from "../../../../ui/document.revision/header/SummaryHeader";
import SummaryPresenter from "../../../../ui/document.revision/summary/presenter";
import { checkIsDocumentForm } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { FBWorkspace } from "../../../../ui/form.builder";
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
  if (tabConfig && group === DOC_TYPE_GROUP.LHR) {
    tabConfig = [ ...tabConfig, {
      labelId: "tabId.materialsandequipment",
      tabId: TabTypeOptions.TABS_MEQ,
      type: TabTypeOptions.TABS_MEQ,
    }];
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
        <SMTemplate
          templateBoxProps={{ stretchY: "100%" }}
          contentBoxProps={{ minHeight: "20%", height: "100%" }}
          boxProps={{ overflow: "scroll" }}
          header={<DocumentRevisionSummaryHeader {...{ documentRevision }} />}
        >
          <Observer>
            {() => (
              <SMTabs
                onChange={(ev, newValue) => onTabChange?.(ev, newValue, tabConfig)}
                tabs={tabLabels}
                boxProps={{ stretchY: "100%", px: 4.25 }}
              >
                {map(tabConfig, (tabInfo: TabInfo) => {
                  const tabType = tabInfo.type;
                  const { tabId } = tabInfo || {};
                  const tabSchema = schema?.filter((schemaItem) => schemaItem.tabId === tabId);
                  const availableSchema = schema?.filter((schemaItem) =>
                    schemaItem.tabId === tabId && !schemaItem.deleted);

                  return <SMBox height="100%"  overflow={"auto"} {...{ onScroll }}>
                    <SMBox mt={2} stretchY="100%">
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
                  </SMBox>;
                })}
              </SMTabs>
            )}
          </Observer>
        </SMTemplate>
      </SMTemplate>
    </SMForm>
  ); };

export default withSMForm(withSMTabs(withDocumentRevisionSummaryWrap(DocumentRevisionSummary)));
