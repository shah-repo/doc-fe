import { FieldArrayRenderProps, FieldProps, FieldArray, ErrorMessage } from "formik";
import { Typography, makeStyles, createStyles } from "@material-ui/core";
import React from "react";
import Text from "../../../../components/Text";
import { ChangeRequestFormValues } from "../../types";
import AttachmentsContainer from '../../attachments/Attachments.container';
import Tasks from './Tasks';

interface Props extends FieldProps<ChangeRequestFormValues> {}

export const styles = makeStyles(() =>
  createStyles({
    error: {
      color: 'red',
    },
  },
));

const Container: React.FunctionComponent<Props> = () => {
  const renderAttachments = (props: FieldArrayRenderProps) => <AttachmentsContainer attachmentsKey="implementationPlan" {...props} />;
  const renderTasks = (props: FieldArrayRenderProps) => <Tasks {...props} />;
  const classes = styles();

  return (
    <React.Fragment>
      <span className={classes.error}>
        <ErrorMessage name="implementationPlan.tasks" />
      </span>
      <Typography>
        <Text message="common.implementation.plan" />
      </Typography>
      <FieldArray name="implementationPlan.tasks" render={renderTasks} />
      <FieldArray name="implementationPlan.attachments" render={renderAttachments} />
    </React.Fragment>
  );
};

export default Container;
