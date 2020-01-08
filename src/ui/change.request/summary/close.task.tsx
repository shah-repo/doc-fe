import {
  Button, Dialog, DialogContent, DialogTitle,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { Fragment } from "react";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import InputField from "../../components/forms/fields/Input";
import { required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import Text from "../../components/Text";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";

interface OwnProps {
  crId: string;
  taskId: string;
  closeTask: typeof changeRequestsActions.closeTask;
}

export type Props = OwnProps;

export const CloseTask: React.FunctionComponent<Props> = ({
  taskId, closeTask, crId,
}) => {
  const dialog = useDialog();
  const async = useAsync();

  const openDialog = () => dialog.open();

  const renderForm = () => {
    return (
      <Form>
        <InputField
          name="closingNote"
          label="common.description"
          inputProps={{ id: "closingNote", multiline: true, rows: "2" }}
          validate={validator(required)}
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth={true}
        >
          <Text translation="common.close.task" />
        </Button>
      </Form>
    );
  };

  const onSubmit = (values: any) => {
    dialog.close();
    async.start(closeTask, crId, taskId, values, async);
  };

  const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();

  return (
    <Fragment>
      <FormProgress asyncState={async.asyncState} />
      <FormMessage asyncState={async.asyncState} />
      <Button
        variant="contained"
        color="secondary"
        fullWidth={true}
        onClick={openDialog}
      >
        <Text translation="common.done" />
      </Button>
      <Dialog
        open={dialog.isOpen}
        onSubmit={preventPropagation}
        onClose={dialog.close}
      >
        <DialogTitle>
          <Text translation="common.closing.note" />
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ closingNote: "" }}
            onSubmit={onSubmit}
          >
            {renderForm}
          </Formik>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default CloseTask;
