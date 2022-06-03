/* eslint-disable react/jsx-key */
import { get, map } from "lodash";
import { reaction } from "mobx";
import { Observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DocumentRevisionFormHeader, DocumentRevisionFormProps, DocumentRevisionHeader, DocumentRevisionLeftPanel, DocumentRevisionSidebar, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentGroupType, TabInfo } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import { DocTypeGroups } from "../../../../ui/dashboard.new/line.items/common/types";
import DocumentRevisionFormPresenter from "../../../../ui/documentRevision/forms/DocumentRevisionForm.presenter";
import { FBWorkspace } from "../../../../ui/form.builder";
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
  availableReferences,
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
}) => {
  const docTypeGroup = get(documentRevision?.document?.documentType, "group", "OTHER");
  const outputTypeGroup = get(documentRevision?.formTemplate?.outputDocumentTypes[0], "group");
  const [tabWidth, setTabWidth] = useState(0);
  const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
  let tabConfig = useSelector((state: ApplicationState) => documentTypeSelectors.getTabConfiguration(state, group));
  if (formValues.values?.retrain) {
    tabConfig = tabConfig && [...tabConfig, {
      labelId: "tabId.training",
      tabId: "training",
      type: "TRAINING",
    } ];
  }
  const tabLabels: string[] = tabConfig?.map((tabInfo) => tabInfo.labelId);
  const trainingTabIndex = tabLabels?.findIndex((tab) => tab === "tabId.training");

  const changeLayoutHeight = () => {
    setTimeout(() => {
      const headerTmpl = document.getElementById("SMHeaderTmpl");
      const bodyTmpl = document.getElementById("SMBodyTmpl");
      setTabWidth(bodyTmpl?.clientWidth || 0);
      const restHeight = headerTmpl?.clientHeight ? 188 + (+(headerTmpl?.clientHeight)) : 200;
      bodyTmpl && (bodyTmpl.style.height = `calc(100vh - ${restHeight}px)`);
    }, 100);
  };

  useEffect(() => reaction(
    () => _documentRevisionFormState?.viewMore,
    () => {
      changeLayoutHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

  useEffect(() => reaction(
    () => _documentRevisionFormState?.rightPanelOpen,
    () => {
      setTimeout(() => {
        const bodyTmpl = document.getElementById("SMBodyTmpl");
        setTabWidth(bodyTmpl?.clientWidth || 0);
      }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

  useEffect(() => {
    changeLayoutHeight();
  }, []);

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
      contentBoxProps={{ minHeight: "calc(100% - 30%)", height: "100%" }}
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
        <SMTemplate
          templateBoxProps={{ stretchY: "100%" }}
          headerBoxProps={{ maxHeight: "80%" }}
          contentBoxProps={{ minHeight: "20%", height: "100%" }}
          header={<DocumentRevisionFormHeader type={type}/>}
        >
          <Observer>
            {() => (
              <SMTabs
                onChange={(ev, newValue) => onTabChange?.(ev, newValue, tabConfig)}
                tabs={tabLabels}
                boxProps={{ stretchY: "100%", px: 3.75 }}
                tabProps={{ width: `${tabWidth - 68}px` }}
              >
                {map(tabConfig, (tabInfo: TabInfo, index: number) => {
                  const tabType = tabInfo.type;

                  return <SMBox height="100%" key={index} overflow={"auto"} {...{ onScroll }}>
                    <SMBox mt={8} stretchY="calc(100% - 40px)">
                      {tabType === "MIXED" && <>
                        <DocumentRevisionFormPresenter
                          {...formValues}
                          releasedDocRev={_documentRevisionFormState?.releasedDocRev}
                          {...{
                            documentRevisions,
                            documentRevision,
                            availableReferences,
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
                        {documentRevision && <FBWorkspace
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
                      {tabType === "DYNAMIC" && _formState?.mode !== "none" &&  (
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

export default withSMTabs(withDocumentRevisionFormWrap(DocumentRevisionForm));
