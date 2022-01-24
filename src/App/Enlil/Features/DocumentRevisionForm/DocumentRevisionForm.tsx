import { Box, Grid } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { DocumentRevisionFooter, DocumentRevisionFormHeader, DocumentRevisionFormProps, DocumentRevisionHeader, DocumentRevisionSidebar, SMForm, SMTabs, SMTemplate } from "../../..";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import DocumentRevisionFormPresenter from "../../../../ui/documentRevision/forms/DocumentRevisionForm.presenter";
import { styles } from "../../../../ui/documentRevision/forms/DocumentRevisionForm.styles";
import { FBWorkspace } from "../../../../ui/form.builder";
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
}) => {
  const classes = styles();
  return (
    <SMForm
      values={formValues.values}
      header= {
        <DocumentRevisionHeader
          {...{ bannerPortal, shouldShowUpgrade }}
          documentRevisionId={documentRevision?.id}
        />
      }
      footer={<DocumentRevisionFooter />}
      {...(_formState?.mode === "form" || _formState?.mode === "formDesign") && {
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
      <SMTemplate header={<DocumentRevisionFormHeader />}>
        <Observer>
          {() => (
            <SMTabs
              onChange={(ev, newValue) => onTabChange?.(ev, newValue)}
              tabs={_formState?.mode === "none" ? ["sm.overview"] : ["sm.overview", "sm.general"]}
              boxProps={{
                height: "100%",
                overflow: "auto",
                onScroll,
              }}
            >
              <Grid
                item={true}
                className={classes.container}
                lg={type !== "newOutput" && isDisabled ? 12 : 7}
                sm={type !== "newOutput" && isDisabled ? 12 : 10}
                xs={12}
              >
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
              </Grid>
              {_formState?.mode !== "none" && (
                <Box mt={5} paddingY={2} paddingX={5} height="calc(100vh - 70px)" overflow="auto">
                  <FBWorkspace
                    isPortal={false}
                    document={{
                      ...formValues.values as unknown as DocumentRevision,
                      ...documentRevision as unknown as DocumentRevision,
                    }}
                    {... { schema, autosaveEnabled }}
                    initialValues={formInput}
                  />
                </Box>
              )}
            </SMTabs>
          )}
        </Observer>
      </SMTemplate>
    </SMForm>
  ); };

export default withSMTabs(withDocumentRevisionFormWrap(DocumentRevisionForm));
