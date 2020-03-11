import { Grid } from "@material-ui/core";
import React from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { AsyncState } from "../../../state/types";
import ChangeRequestHeader from "../../change.request/summary/header";
import ChangeRequestAuditContainer from "../audit/Audit.container";
import AssessmentFormContainer from "./assessmentForm/AssessmentForm.container";
import { ChangeRequestFormValues } from "./types";

interface OwnProps {
  initialValues: ChangeRequestFormValues;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  documentRevisionsList: string[];
  onSubmit: (values: ChangeRequestFormValues) => void;
}

type ChangeRequestFormPresenterProps = OwnProps;

export const ChangeRequestFormPresenter: React.FunctionComponent<
ChangeRequestFormPresenterProps
> = ({
  initialValues,
  onSubmit,
  asyncState,
  changeRequest,
  documentRevisionsList,
  doNotPrompt,
}) => {
  const renderAssessmentForm = (
    <AssessmentFormContainer
      initialValues={initialValues}
      onSubmit={onSubmit}
      asyncState={asyncState}
      changeRequest={changeRequest}
      documentRevisionsList={documentRevisionsList}
      doNotPrompt={doNotPrompt}
    />
  );

  const renderChangeRequestAudit = changeRequest &&
      <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />;

  return (
    <>
      <Grid item={true} xs={12} sm={6} md={7}>
        {changeRequest  && <ChangeRequestHeader dataProp={changeRequest} />}
        {renderAssessmentForm}
      </Grid>
      <Grid item={true} xs={12} sm={3} md={3}>
        {renderChangeRequestAudit}
      </Grid>
    </>
  );
};

export default ChangeRequestFormPresenter;
