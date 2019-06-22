import { Form, Formik } from "formik";
import { Button } from "@material-ui/core";
import React from "react";
import InputField from "../../../../components/forms/fields/Input";
import { validator, required } from "../../../../components/forms/fields/validators";
import Text from "../../../../components/Text";

interface Props {
  cancel: () => void;
}

const TaskForm: React.FunctionComponent<Props> = ({
  cancel,
}) => {
  return (
    <Form>
      <InputField
        name="description"
        label="changeRequest.assessmentForm.description"
        inputProps={{ id: "description" }}
        validate={validator(required)}
      />
      <Button type="submit" color="primary">
        <Text translation="transition.action.confirm" />
      </Button>
      <Button
        variant="text"
        color="secondary"
        onClick={cancel}
      >
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default TaskForm;
