import { Grid } from "@material-ui/core";
import { FormikErrors } from "formik";
import React from "react";
import { SM } from "../../../App";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DataProps } from "../../../state/ducks/common/types";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import { AsyncState } from "../../../state/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import SubmitButton from "../../components/forms/SubmitButton";
import ControlsContainer from "../form/assessmentForm/AssessmentFormControls.container";

interface Props extends DataProps<ChangeRequest> {
  asyncState: AsyncState;
  canChangeOwnership: boolean;
  errors: FormikErrors<any>;
  canEdit: boolean;
}

const SummaryHeader: React.FunctionComponent<Props> = ({
  dataProp,
  dataProp: { state, title, crId, id, formDocument },
  canChangeOwnership,
  asyncState,
  errors,
  canEdit,
}) => {
  const isNewLayout = SM.isNewCRLayout;
  const submitButtonRenderer = canEdit && (
    <SubmitButton
      asyncState={asyncState}
      label="document.save"
      errors={errors}
      showNewButton={isNewLayout}
    />
  );
  return (
    <Header status={state as unknown as DocumentRevisionStatus}>
      <HeaderInfo status={state} id={crId} name={title}/>
      <Grid item={true} xs={6} justify="center">
        <Grid container={true} alignItems="center" justify="flex-end">
          {submitButtonRenderer}
          <ControlsContainer changeRequest={dataProp} errors={errors} />
        </Grid>
      </Grid>
    </Header>
  ); };

export default SummaryHeader;
