import { Box, Grid, LinearProgress } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { ReactComponent as CloudIcon } from "../../../../../assets/images/cloud.svg";
import Header from "../../../../../ui/components/common/header/Header";
import HeaderInfo from "../../../../../ui/components/common/header/HeaderInfo";
import { generateSubtitle } from "../../../../../ui/components/common/header/subtitles";
import FormMessage from "../../../../../ui/components/forms/FormMessage";
import FormProgress from "../../../../../ui/components/forms/FormProgress";
import Text from "../../../../../ui/components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../../../../ui/constants/urls";
import { FormHeaderContext } from "../../../../../ui/documentRevision/forms/DocumentRevisionForm.container";
import DocRevActions from "../../../../../ui/documentRevision/forms/presenters/Actions";
import { isFormWithInlineApproval } from "../../../../../ui/documentRevision/helpers/records";
import Colors from "../../../../../ui/layout/theme/utils/colors";
import SM from "../../../Utils/SM/SM";
import NewDocRevActions from "../presenters/Actions";
import { styles } from "./FormHeader.styles";

interface Props {
  isCreateDocumentDisabled: boolean;
  newVarient?: boolean;
}

const NewFormHeaderPresenter: React.FunctionComponent<Props> = ({
  isCreateDocumentDisabled,
  newVarient = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const  { documentRevision, isDisabled, asyncState, type, lastSavedTimestamp } = React.useContext(FormHeaderContext)!;
  const { _formState } = SM.useStores();
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  const classes = styles();
  return (
    <Header
      status={documentRevision?.status}
      displayStatus={documentRevision?.displayStatus}
    >
      {documentRevision && (
        <HeaderInfo
          revisionStage={documentRevision.revisionStage}
          groupOptions={documentRevision.document.documentType.groupOptions}
          isInlineApproval={isFormWithInlineApproval(
            documentRevision.formDocument?.formTemplate?.schema
          )}
          status={documentRevision.status}
          id={documentRevision.document.docId}
          name={documentRevision.name}
          documentTypeId={documentRevision?.document?.documentType.id}
          revisionChangeType={documentRevision?.revisionChangeType}
          subRevision={documentRevision?.subRevision}
          displayStatus={documentRevision.displayStatus}
          subtitle={generateSubtitle(documentRevision)}
          newVarient={newVarient}
          displayRevision={documentRevision.displayRevision}
        />
      )}
      <Grid
        item={true}
        xs={type !== "newOutput" && isDisabled ? 6 : 12}
        alignContent="center"
      >
        <Grid container={true} alignItems="center" justify="flex-end">
          {lastSavedTimestamp && (
            <Box
              display="flex"
              alignItems="center"
              color={Colors.white}
              className={classes.lastEdited}
            >
              <CloudIcon className={classes.cloudIcon} />
              <Text
                translation="form.builder.header.lastSaved"
                values={{
                  lastSavedTimestamp,
                }}
              />
            </Box>
          )}
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
                <LinearProgress className={classes.linearProgress} />
              </Box>
            )}
          </>
        )}
      </Observer>
    </Header>
  );
};
export default NewFormHeaderPresenter;
