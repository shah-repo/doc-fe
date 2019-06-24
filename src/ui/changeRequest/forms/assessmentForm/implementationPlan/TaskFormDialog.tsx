import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import { Formik, FormikProps } from "formik";
import React from "react";
import Text from "../../../../components/Text";
import { ImplementationPlanTask } from "../../types";
import TaskForm from "./TaskForm";

export interface OwnProps {
  onSubmit: (values: ImplementationPlanTask) => void;
  closeDialog: () => void;
  openDialog: () => void;
  isDialogOpen: boolean;
  buttonProps?: ButtonProps;
}

type TaskFormDialogProps = OwnProps;

const INITIAL_VALUES = {
  title: "",
  description: "",
  assigned: [],
};

export const TaskFormDialog: React.FunctionComponent<TaskFormDialogProps> =
  ({ onSubmit, closeDialog, openDialog, isDialogOpen, buttonProps }) => {
    const renderForm = (props: FormikProps<any>) => (
      <TaskForm cancel={closeDialog} />
    );

    const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();

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
        >
          <DialogTitle>
            <Text translation="changeRequest.assessmentForm.addTask" />
          </DialogTitle>
          <DialogContent>
            <Formik
              render={renderForm}
              initialValues={INITIAL_VALUES}
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  };

export default TaskFormDialog;
