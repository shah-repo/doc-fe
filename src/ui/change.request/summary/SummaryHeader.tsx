import { Grid } from "@material-ui/core";
import { FormikErrors } from "formik";
import React from "react";
import { SM } from "../../../App";
import FormSubmitButton from "../../../App/Shifamed/Components/forms/presenters/SubmitButton";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DataProps } from "../../../state/ducks/common/types";
import { AsyncState } from "../../../state/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import SubmitButton from "../../components/forms/SubmitButton";
import ExportARToEmail from "../export.email/ExportAREmail";
import ControlsContainer from "../form/assessmentForm/AssessmentFormControls.container";

interface Props extends DataProps<ChangeRequest> {
  asyncState: AsyncState;
  canChangeOwnerShip: boolean;
  errors: FormikErrors<any>;
  canEdit: boolean;
}

const SummaryHeader: React.FunctionComponent<Props> = ({
  dataProp,
  dataProp: { state, title, crId, id },
  canChangeOwnerShip,
  asyncState,
  errors,
  canEdit,
}) => {

  let submitButtonRenderer = canEdit && (
    <SubmitButton
      asyncState={asyncState}
      label="document.save"
      errors={errors}
    />
  );
  if (SM.isNewLayout) {
    submitButtonRenderer =  canEdit && (
      <FormSubmitButton
        asyncState={asyncState}
        label="document.save"
        errors={errors}
      />
    );
  }
  return (
    <Header>
      <HeaderInfo status={state} id={crId} name={title}/>
      <Grid item={true} xs={6} justify="center">
        <Grid container={true} alignItems="center" justify="flex-end">
          {submitButtonRenderer}
          <ExportARToEmail {...{ id }}/>
          <ControlsContainer changeRequest={dataProp} errors={errors} />
        </Grid>
      </Grid>
    </Header>
  ); };

export default SummaryHeader;
