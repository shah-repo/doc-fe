import { map } from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionFooter, DocumentRevisionSidebar, DocumentRevisionSummaryHeader, DocumentRevisionSummaryProps, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { TabInfo } from "../../../../state/ducks/documentRevisions/documentType/types";
import { ApplicationState } from "../../../../state/reducers";
import SummaryHeader from "../../../../ui/document.revision/header/SummaryHeader";
import SummaryPresenter from "../../../../ui/document.revision/summary/presenter";
import { checkIsDocumentForm } from "../../../../ui/documentRevision/helpers/checkDocumentGroup";
import { FBWorkspace } from "../../../../ui/form.builder";
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
  const group = documentRevision?.document?.documentType?.group || "OTHER";
  let tabConfig = useSelector((state: ApplicationState) =>
    documentTypeSelectors.getTabConfiguration(state, group));
  if (documentRevision.retrain) {
    tabConfig = [...tabConfig, {
      labelId: "tabId.training",
      tabId: "training",
      type: "TRAINING",
    } ];
  }
  const tabLabels: string[] = tabConfig.map((tabInfo) => tabInfo.labelId);
  const isDynamic = Boolean(tabConfig.find((tabInfo) => tabInfo.type === "DYNAMIC"));
  const trainingTabIndex = tabLabels.findIndex((tab) => tab === "tabId.training");

  return (
    <SMForm
      templateBoxProps={{ stretchY: "100%" }}
      headerBoxProps={{ maxHeight: "30%" }}
      contentBoxProps={{ minHeight: "calc(100% - 30%)", height: "100%" }}
      values={documentRevision}
      header= {
        <SummaryHeader
          canShowCreateVersionButton={true}
          {...{ documentRevision, canChangeOwnerShip }}
        />
      }
    >
      <SMTemplate
        templateBoxProps={{ stretchY: "100%", borderTop: 1, borderColor: Colors.medium_gray }}
        contentBoxProps={{ stretchY: "100%" }}
        rightSidebarBoxProps={{ zIndex: 2 }}
        {..._documentRevisionFormState?.documentRevision && {
          rightSidebar: (
            <Observer>
              {() => <DocumentRevisionSidebar />}
            </Observer>
          ),
        }}
      >
        <SMTemplate
          templateBoxProps={{ stretchY: "100%" }}
          headerBoxProps={{ maxHeight: "80%" }}
          contentBoxProps={{ minHeight: "20%", height: "100%" }}
          footer={<DocumentRevisionFooter />}
          header={<DocumentRevisionSummaryHeader {...{ documentRevision }} />}
        >
          <Observer>
            {() => (
              <SMTabs
                onChange={(ev, newValue) => onTabChange?.(ev, newValue)}
                tabs={tabLabels}
                boxProps={{ stretchY: "100%" }}
              >
                {map(tabConfig, (tabInfo: TabInfo) => {
                  const tabType = tabInfo.type;
                  const showFBLabels = tabType === "MIXED" ? !isDynamic : isDynamic;

                  return <SMBox height="100%" overflow={"auto"} {...{ onScroll }}>
                    <SMBox mt={8} px={8}>
                      {tabType === "MIXED" &&  <SummaryPresenter
                        dataProp={documentRevision}
                        canChangeOwnerShip={canChangeOwnerShip}
                        canShowCreateVersionButton={true}
                      />}
                      {isFB && showFBLabels && (
                        <SMBox height="100%" overflow={"auto"} {...{ onScroll }}>
                          <SMBox mt={8} pr={6} stretchY="100%">
                            <FBWorkspace
                              document={documentRevision}
                              initialValues={documentRevision.formInput}
                              schema={schema}
                              mode={checkIsDocumentForm(documentRevision?.document.documentType.groupOptions) ?
                                "formPreview" : "preview"}
                            />
                          </SMBox>
                        </SMBox>
                      )}
                      {tabType === "TRAINING" &&
                          _tabsState?.value === trainingTabIndex && (
                        <FBTrainingInfoContainer
                          documentRevisionId={documentRevision?.id}
                        />
                      )}
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
