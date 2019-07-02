import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikProps } from "formik";
import React from "react";
import Text from "../../../../components/Text";
import { ImplementationPlanTaskForm } from "../../types";
import TaskForm from "./TaskForm";

export interface OwnProps {
  onSubmit: (values: ImplementationPlanTaskForm) => void;
  closeDialog: () => void;
  openDialog: () => void;
  isDialogOpen: boolean;
  buttonProps?: ButtonProps;
  task: ImplementationPlanTaskForm | null;
}

export type TaskFormDialogProps = OwnProps;

const INITIAL_VALUES = {
  title: "",
  description: "",
};

const styles = makeStyles(() =>
  createStyles({
    dialogPaper: {
      overflowY: 'unset'
    },
    dialogContent: {
      overflowY: 'unset'
    }
  },
));

export const TaskFormDialog: React.FunctionComponent<TaskFormDialogProps> =
  ({ onSubmit, closeDialog, openDialog, isDialogOpen, buttonProps, task }) => {
    const renderForm = (props: FormikProps<any>) => (
      <TaskForm cancel={closeDialog} />
    );
    const classes = styles();

    const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();
    const initialValues = task || INITIAL_VALUES;

    return (
      <div>
        <Button
          color="primary"
          variant="contained"
          onClick={openDialog}
          {...buttonProps}
        >
          <Text translation="changeRequest.assessmentForm.addTask" />
        </Button>
        <Dialog
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
          open={isDialogOpen}
          onSubmit={preventPropagation}
          classes={{ paper: classes.dialogContent }}
        >
          <DialogTitle>
            <Text translation="changeRequest.assessmentForm.addTask" />
          </DialogTitle>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <Formik
              render={renderForm}
              initialValues={initialValues}
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default TaskFormDialog;
