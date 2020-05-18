import { Grid } from "@material-ui/core";
import React from "react";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import { FormHeaderContext } from "../../documentRevision/forms/DocumentRevisionForm.presenter";
import DocRevActions from "../../documentRevision/forms/presenters/Actions";
import DocumentListInfo from "./DocumentListInfo";
import Header from "./Header";

const FormHeaderPresenter: React.FunctionComponent = () => {
  const  { documentRevision, isDisabled, asyncState } = React.useContext(FormHeaderContext)!;
  return (
    <Header>
      {documentRevision && <DocumentListInfo documentRevision={documentRevision} />}
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
