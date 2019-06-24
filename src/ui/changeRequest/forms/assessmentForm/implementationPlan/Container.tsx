import { FieldArrayRenderProps, FieldProps, FieldArray, ErrorMessage } from "formik";
import { Typography, Button } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";
import { ChangeRequestFormValues } from "../../types";
import AttachmentsContainer from '../../attachments/Attachments.container';
import Tasks from './Tasks';

interface Props extends FieldProps<ChangeRequestFormValues> {}

const Container: React.FunctionComponent<Props> = () => {
  const renderAttachments = (props: FieldArrayRenderProps) => <AttachmentsContainer attachmentsKey="implementationPlan" {...props} />;
  const renderTasks = (props: FieldArrayRenderProps) => <Tasks {...props} />;

  return (
    <React.Fragment>
      <span style={{ color: 'red' }}>
        <ErrorMessage name="implementationPlan" />
      </span>
      <Typography>
        <Text message="changeRequest.assessmentForm.implementationPlan" />
      </Typography>
      <FieldArray name="implementationPlan.implementationPlanTasks" render={renderTasks} />
      <FieldArray name="implementationPlan.attachments" render={renderAttachments} />
    </React.Fragment>
  );
};

export default Container;
