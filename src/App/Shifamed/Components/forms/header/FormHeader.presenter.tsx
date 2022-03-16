import { Box, Grid, LinearProgress } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../../../../ui/components/common/header/Header";
import { generateSubtitle } from "../../../../../ui/components/common/header/subtitles";
import FormMessage from "../../../../../ui/components/forms/FormMessage";
import FormProgress from "../../../../../ui/components/forms/FormProgress";
import { FormHeaderContext } from "../../../../../ui/documentRevision/forms/DocumentRevisionForm.container";
import DocRevActions from "../../../../../ui/documentRevision/forms/presenters/Actions";
import { isFormWithInlineApproval } from "../../../../../ui/documentRevision/helpers/records";
import SM from "../../../Utils/SM/SM";
import NewDocRevActions from "../presenters/Actions";
import HeaderInfo from "./HeaderInfo";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const NewFormHeaderPresenter: React.FunctionComponent<Props> = ({ isCreateDocumentDisabled }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const  { documentRevision, isDisabled, asyncState, type, lastSavedTimestamp } = React.useContext(FormHeaderContext)!;
  const { _formState } = SM.useStores();
  const location = useLocation();
  const isCreateUrl = SM.pathname.includes("document_revision/create");
  return (
    <Header status={documentRevision?.status} displayStatus={documentRevision?.displayStatus}>
      {documentRevision &&
      <HeaderInfo
        revisionStage={documentRevision.revisionStage}
        groupOptions={documentRevision.document.documentType.groupOptions}
        isInlineApproval={isFormWithInlineApproval(documentRevision.formDocument?.formTemplate?.schema)
        }
        navigationDetails={location.state}
        status={documentRevision.status}
        id={documentRevision.document.docId}
        name={documentRevision.name}
        documentTypeId={documentRevision?.document?.documentType.id}
        revisionChangeType={documentRevision?.revisionChangeType}
        subRevision={documentRevision?.subRevision}
        displayStatus={documentRevision.displayStatus}
        subtitle={generateSubtitle(documentRevision)}
      />}
      <Grid item={true} xs={type !== "newOutput" && isDisabled ? 6 : 12} alignContent="center">{!isCreateUrl && type}
        <Grid container={true} alignItems="center" justify="flex-end">
          <Box alignSelf="center">
            {lastSavedTimestamp &&
            <Box>
              Last saved: &nbsp;
              {lastSavedTimestamp}
            </Box>
            }
          </Box>
          {SM.isNewLayout && !isCreateUrl ? (
            <NewDocRevActions {...{ isCreateDocumentDisabled }} />
          ) : (
            <DocRevActions {...{ isCreateDocumentDisabled }} />
          )}
        </Grid>
      </Grid>
      <FormMessage asyncState={asyncState} />
      <FormProgress asyncState={asyncState} fullWidth />
      <Observer>
        {() => (
          <>
            {_formState?.loading && (
              <Box width="100%" pt={1}>
                <LinearProgress style={{ width: "100%" }} />
              </Box>
            )}
          </>
        )}
      </Observer>
    </Header>
  );
};
export default NewFormHeaderPresenter;
