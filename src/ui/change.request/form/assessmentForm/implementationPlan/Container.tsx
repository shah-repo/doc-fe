import { createStyles, makeStyles } from "@material-ui/core";
import { ErrorMessage, FieldArray, FieldArrayRenderProps, FieldProps } from "formik";
import React from "react";
import AttachmentField from "../../../../components/common/attachment.field/container";
import AttachmentIconField from "../../../../components/common/attachment.icon/container";
import HeaderField from "../../../../components/common/header.field/field";
import { ChangeRequestFormValues } from "../../types";
import Tasks from "./Tasks.container";

export type Props = FieldProps<ChangeRequestFormValues>;

const styles = makeStyles(() =>
  createStyles({
    error: {
      color: "red",
    },
  },
  ));

const Container: React.FunctionComponent<Props> = () => {

  const renderTasks = (props: FieldArrayRenderProps) => <Tasks {...props} />;
  const classes = styles();

  const actionsRenderer = () => (
    // *NOTE: we need to add Add Task action here
    <React.Fragment>
      <AttachmentField name="implementationPlan.attachments" />
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <span className={classes.error}>
        <ErrorMessage name="implementationPlan.tasks" />
      </span>
      <HeaderField dataProp="common.implementation.plan" variant="regular" actionsRenderer={actionsRenderer} />
      <FieldArray name="implementationPlan.tasks">
        {renderTasks}
      </FieldArray>
      <AttachmentIconField name="implementationPlan.attachments" />
    </React.Fragment>
  );
};

export default Container;
