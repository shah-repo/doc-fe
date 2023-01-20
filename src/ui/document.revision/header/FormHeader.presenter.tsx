import { Grid, LinearProgress } from "@material-ui/core";
import { useObserver } from "mobx-react";
import React from "react";
import { useSelector } from "react-redux";
import { SM } from "../../../App";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { AsyncStatus } from "../../../state/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import HeaderLastSaved from "../../components/common/header/HeaderLastSaved";
import { generateSubtitle } from "../../components/common/header/subtitles";
import FormMessage from "../../components/forms/FormMessage";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import { FormHeaderContext } from "../../documentRevision/forms/DocumentRevisionForm.container";
import DocRevActions from "../../documentRevision/forms/presenters/Actions";
import { isFormWithInlineApproval } from "../../documentRevision/helpers/records";
import { FB } from "../../form.builder";
import { getVersionNumber } from "../utils/helpers";
import useStyles from "./FormHeader.styles";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const FormHeaderPresenter: React.FunctionComponent<Props> = ({
  isCreateDocumentDisabled,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { documentRevision, isDisabled, asyncState, type } = React.useContext(FormHeaderContext)!;
  const { workspaceState } = FB.useStores();
  const { _documentRevisionFormState } = SM.useStores();
  const asyncSecurityState = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getLoadAsyncSecurityState(state));

  const isLoading = useObserver(() => (
    asyncSecurityState.status === AsyncStatus.Active
    || asyncState.status === AsyncStatus.Active
      || workspaceState?.documentRevApi.loading
      || _documentRevisionFormState?.loading)
  );

  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  const classes = useStyles(isCreateUrl);
  return (
    <Header status={documentRevision?.status} displayStatus={documentRevision?.displayStatus}>
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
        displayRevision={getVersionNumber(documentRevision.id)}
        relatedParentPartDetails={documentRevision.relatedParentPartDetails}
      />
      }
      <Grid item={true} xs={type !== "newOutput" && isDisabled ? 6 : 12} alignContent="center" container>
        <Grid container={true} alignItems="center" justify="flex-end">
          {documentRevision?.updatedAt && (
            <HeaderLastSaved
              timestamp={documentRevision.updatedAt}
              loading={asyncState.status === AsyncStatus.Active || asyncSecurityState.status === AsyncStatus.Active}
            />
          )}
          <DocRevActions {...{ isCreateDocumentDisabled }} />
        </Grid>
      </Grid>
      <FormMessage asyncState={asyncState} data-cy="Document-Save-Progress-Bar" />
      {isLoading && <LinearProgress className={classes.linearProgress} data-cy="Document-Save-Progress-Bar" />}
    </Header>
  );
};
export default FormHeaderPresenter;
