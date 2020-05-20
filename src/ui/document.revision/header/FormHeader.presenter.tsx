import { Grid } from "@material-ui/core";
import React from "react";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import { FormHeaderContext } from "../../documentRevision/forms/DocumentRevisionForm.presenter";
import DocRevActions from "../../documentRevision/forms/presenters/Actions";

const FormHeaderPresenter: React.FunctionComponent = () => {
  const  { documentRevision, isDisabled, asyncState } = React.useContext(FormHeaderContext)!;
  return (
    <Header>
      {documentRevision &&
      <HeaderInfo
        status={documentRevision.status}
        id={documentRevision.document.docId}
        name={documentRevision.name}
        documentTypeAcronym={documentRevision?.document?.documentType.documentTypeAcronym}
      />}
      <Grid item={true} xs={isDisabled ? 6 : 12} justify="flex-end">
        <Grid container={true} alignItems="flex-end" justify="flex-end">
          <DocRevActions/>
        </Grid>
      </Grid>
      <FormMessage asyncState={asyncState} />
      <FormProgress asyncState={asyncState} fullWidth />
    </Header>
  );
};
export default FormHeaderPresenter;
