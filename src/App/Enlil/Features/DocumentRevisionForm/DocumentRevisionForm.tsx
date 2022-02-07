import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFooter, DocumentRevisionFormHeader, DocumentRevisionFormProps, DocumentRevisionHeader, DocumentRevisionSidebar, SMBox, SMForm, SMTabs, SMTemplate } from "../../..";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import DocumentRevisionFormPresenter from "../../../../ui/documentRevision/forms/DocumentRevisionForm.presenter";
import { FBWorkspace } from "../../../../ui/form.builder";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMTabs } from "../../../Shifamed/Components/SMTabs/SMTabs.hoc";
import { withDocumentRevisionFormWrap } from "./DocumentRevisionForm.wrap";

const DocumentRevisionForm: React.FunctionComponent<DocumentRevisionFormProps> = ({
  onTabChange,
  setDocId,
  onDirtyFlagChange,
  onScroll,
  _formState,
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
}) => (
  <SMForm
    templateBoxProps={{ stretchY: "100%" }}
    contentBoxProps={{ stretchY: "calc(100% - 66px)" }}
    headerBoxProps={{ maxHeight: "66px" }}
    values={formValues.values}
    header= {
      <DocumentRevisionHeader
        {...{ bannerPortal, shouldShowUpgrade }}
        documentRevisionId={documentRevision?.id}
      />
    }
  >
    <SMTemplate
      templateBoxProps={{ stretchY: "100%", borderTop: 1, borderColor: Colors.medium_gray }}
      contentBoxProps={{ stretchY: "100%" }}
      rightSidebarBoxProps={{ zIndex: 2 }}
      {..._documentRevisionFormState?.id && {
        rightSidebar: (
          <Observer>
            {() => (
              <>
                {_documentRevisionFormState?.documentRevision && <DocumentRevisionSidebar />}
              </>
            )}
          </Observer>
        ),
      }}
    >
      <SMTemplate
        templateBoxProps={{ stretchY: "100%", bgcolor: Colors.light_gray }}
        footerBoxProps={{ maxHeight: "10%" }}
        headerBoxProps={{ maxHeight: "70%" }}
        contentBoxProps={{ minHeight: "20%" }}
        footer={<DocumentRevisionFooter />}
        header={<DocumentRevisionFormHeader />}

      >
        <Observer>
          {() => (
            <SMTabs
              onChange={(ev, newValue) => onTabChange?.(ev, newValue)}
              tabs={_formState?.mode === "none" ? ["sm.overview"] : ["sm.overview", "sm.general"]}
              boxProps={{ stretchY: "100%" }}
            >
              <SMBox height="100%" overflow={"auto"} {...{ onScroll }}>
                <SMBox mt={8} px={8}>
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
                    }}
                  />
                </SMBox>
              </SMBox>
              {_formState?.mode !== "none" && (
                <SMBox height="100%" overflow={"auto"} {...{ onScroll }}>
                  <SMBox mt={8} px={8} stretchY="100%">
                    <FBWorkspace
                      isPortal={false}
                      document={{
                        ...formValues.values as unknown as DocumentRevision,
                        ...documentRevision as unknown as DocumentRevision,
                      }}
                      {... { schema, autosaveEnabled }}
                      initialValues={formInput}
                    />
                  </SMBox>
                </SMBox>
              )}
            </SMTabs>
          )}
        </Observer>
      </SMTemplate>
    </SMTemplate>
  </SMForm>
);

export default withSMTabs(withDocumentRevisionFormWrap(DocumentRevisionForm));
