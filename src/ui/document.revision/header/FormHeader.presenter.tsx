import { Box, Grid, LinearProgress } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { SM } from "../../../App";
import NewDocRevActions from "../../../App/Shifamed/Components/forms/presenters/Actions";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import { generateSubtitle } from "../../components/common/header/subtitles";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import { FormHeaderContext } from "../../documentRevision/forms/DocumentRevisionForm.container";
import DocRevActions from "../../documentRevision/forms/presenters/Actions";
import { isFormWithInlineApproval } from "../../documentRevision/helpers/records";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const FormHeaderPresenter: React.FunctionComponent<Props> = ({ isCreateDocumentDisabled }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const  { documentRevision, isDisabled, asyncState, type, lastSavedTimestamp } = React.useContext(FormHeaderContext)!;
  const { _formState } = SM.useStores();
  return (
    <Header status={documentRevision?.status} displayStatus={documentRevision?.displayStatus}>
      {documentRevision &&
      <HeaderInfo
        revisionStage={documentRevision.revisionStage}
        groupOptions={documentRevision.document.documentType.groupOptions}
        isInlineApproval={isFormWithInlineApproval(documentRevision.formDocument?.formTemplate?.schema)
        }
        status={documentRevision.status}
        displayRevision={documentRevision?.displayRevision}
        group={documentRevision?.document?.documentType?.group}
        id={documentRevision.document.docId}
        name={documentRevision.name}
        documentTypeId={documentRevision?.document?.documentType.id}
        revisionChangeType={documentRevision?.revisionChangeType}
        subRevision={documentRevision?.subRevision}
        displayStatus={documentRevision.displayStatus}
        subtitle={generateSubtitle(documentRevision)}
      />}
      <Grid item={true} xs={type !== "newOutput" && isDisabled ? 6 : 12}>{type}
        <Grid container={true} alignItems="flex-end" justify="flex-end">
          <Box alignSelf="center">
            {lastSavedTimestamp &&
            <Box>
              Last saved: &nbsp;
              {lastSavedTimestamp}
            </Box>
            }
          </Box>
          {SM.isNewLayout ? (
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
export default FormHeaderPresenter;
