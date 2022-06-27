import { Box, Grid, LinearProgress } from "@material-ui/core";
import { Observer } from "mobx-react";
import React from "react";
import { SM } from "../../../App";
import { ReactComponent as CloudIcon } from "../../../assets/images/cloud.svg";
import { AsyncStatus } from "../../../state/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import { generateSubtitle } from "../../components/common/header/subtitles";
import FormMessage from "../../components/forms/FormMessage";
import Text from "../../components/Text";
import { FormHeaderContext } from "../../documentRevision/forms/DocumentRevisionForm.container";
import DocRevActions from "../../documentRevision/forms/presenters/Actions";
import { isFormWithInlineApproval } from "../../documentRevision/helpers/records";
import { FB } from "../../form.builder";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "./FormHeader.styles";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const FormHeaderPresenter: React.FunctionComponent<Props> = ({
  isCreateDocumentDisabled,
}) => {
  const isNewLayout = SM.isNewLayout;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const  { documentRevision, isDisabled, asyncState, type, lastSavedTimestamp } = React.useContext(FormHeaderContext)!;
  const { workspaceState } = FB.useStores();
  const { _documentRevisionFormState } = SM.useStores();
  const classes = styles();
  const renderLastSavedContnet = () => (
    <Box>
      Last saved: &nbsp;
      {lastSavedTimestamp}
    </Box>
  );
  const newRenderLastSavedContnet = () => (
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
  );
  return (
    <Header status={documentRevision?.status} displayStatus={documentRevision?.displayStatus} >
      {documentRevision &&
      <HeaderInfo
        revisionStage={documentRevision.revisionStage}
        groupOptions={documentRevision.document.documentType.groupOptions}
        isInlineApproval={isFormWithInlineApproval(documentRevision.formDocument?.formTemplate?.schema)
        }
        status={documentRevision.status}
        id={documentRevision.document.docId}
        name={documentRevision.name}
        documentTypeId={documentRevision?.document?.documentType.id}
        revisionChangeType={documentRevision?.revisionChangeType}
        subRevision={documentRevision?.subRevision}
        displayStatus={documentRevision.displayStatus}
        subtitle={generateSubtitle(documentRevision)}
        displayRevision={documentRevision.displayRevision}
      />
      }
      <Grid item={true} xs={type !== "newOutput" && isDisabled ? 6 : 12} alignContent="center" container>
        <Grid container={true} alignItems="center" justify="flex-end">
          {lastSavedTimestamp && !isNewLayout && renderLastSavedContnet()}
          {lastSavedTimestamp && isNewLayout && newRenderLastSavedContnet()}
          <DocRevActions {...{ isCreateDocumentDisabled }} />
        </Grid>
      </Grid>
      <FormMessage asyncState={asyncState} />
      <Observer>
        {() => (
          <>
            {(asyncState.status === AsyncStatus.Active ||
              workspaceState?.documentRevApi.loading ||
              _documentRevisionFormState?.loading) && (
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
export default FormHeaderPresenter;
