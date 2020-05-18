import { Grid } from "@material-ui/core";
import { FormikErrors } from "formik";
import React from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
import Header from "../../components/common/header/Header";
import HeaderInfo from "../../components/common/header/HeaderInfo";
import OwnerChangerContainer from "../../components/common/owner.changer/container";
import { RequestType } from "../../components/common/owner.changer/helpers/types";
import SubmitButton from "../../components/forms/SubmitButton";
import ControlsContainer from "../form/assessmentForm/AssessmentFormControls.container";

export interface Props extends DataProps<ChangeRequest> {
  asyncState: AsyncState;
  canChangeOwnerShip: boolean;
  errors: FormikErrors<any>;
  canEdit: boolean;
}

export const SummaryHeader: React.FunctionComponent<Props> = ({
  dataProp,
  dataProp: { state, title, crId, id },
  canChangeOwnerShip,
  asyncState,
  errors,
  canEdit,
}) => {
  const renderChangeOwnership = canChangeOwnerShip && (
    <OwnerChangerContainer
      requestId={id}
      requestType={RequestType.ChangeRequest}
    />
  );
  const submitButtonRenderer = canEdit && (
    <SubmitButton
      asyncState={asyncState}
      label="document.save"
      errors={errors}
    />
  );
  return (
    <Header>
      <HeaderInfo status={state} id={crId} name={title}/>
      <Grid item={true} xs={6} justify="flex-end">
        <Grid container={true} alignItems="flex-end" justify="flex-end">
          {submitButtonRenderer}
          {renderChangeOwnership}
          <ControlsContainer changeRequest={dataProp} errors={errors} />
        </Grid>
      </Grid>
    </Header>
  ); };

export default SummaryHeader;
