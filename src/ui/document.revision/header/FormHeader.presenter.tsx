import { Grid } from "@material-ui/core";
import React from "react";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import { FormHeaderContext } from "../../documentRevision/forms/DocumentRevisionForm.presenter";
import DocRevActions from "../../documentRevision/forms/presenters/Actions";
import { isFormWithInlineApproval } from "../../documentRevision/helpers/records";

interface Props {
  isCreateDocumentDisabled: boolean;
}

const FormHeaderPresenter: React.FunctionComponent<Props> = ({ isCreateDocumentDisabled }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const  { documentRevision, isDisabled, asyncState, type } = React.useContext(FormHeaderContext)!;
  return (
    <Header>
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
      />}
      <Grid item={true} xs={type !== "newOutput" && isDisabled ? 6 : 12}>
        <Grid container={true} alignItems="flex-end" justify="flex-end">
          <DocRevActions {...{ isCreateDocumentDisabled }}/>
        </Grid>
      </Grid>
      <FormMessage asyncState={asyncState} />
      <FormProgress asyncState={asyncState} fullWidth />
    </Header>
  );
};
export default FormHeaderPresenter;
