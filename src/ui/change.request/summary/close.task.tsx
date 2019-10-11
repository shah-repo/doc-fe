import {
  Button, Dialog, DialogTitle, DialogContent,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Text from "../../components/Text";
import useDialog from "../../hooks/useDialog";
import InputField from "../../components/forms/fields/Input";
import { validator, required } from "../../components/forms/fields/validators";
import { Formik, Form } from "formik";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import useAsync from "../../hooks/useAsync";
import FormProgress from "../../components/forms/FormProgress";
import FormMessage from "../../components/forms/FormMessage";

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
    )
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
            render={renderForm}
            initialValues={{ closingNote: "" }}
            onSubmit={onSubmit}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default CloseTask;
