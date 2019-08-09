import {
  Button, Dialog, DialogTitle, DialogContent,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Text from "../../components/Text";
import useDialog from "../../hooks/useDialog";
import InputField from "../../components/forms/fields/Input";
import { validator, required } from "../../components/forms/fields/validators";
import { Formik, Form } from "formik";

interface OwnProps {
  taskId: string;
}

type Props = OwnProps;

const CloseTask: React.FunctionComponent<Props> = ({
  taskId,
}) => {
  const dialog = useDialog();

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
          <Text translation="common.close" />
        </Button>
      </Form>
    )
  };

  const onSubmit = (action: any) => { console.log("clik"); console.log(action); }
  const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();

  return (
    <Fragment>
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
        //onClose={dialog.close}
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
