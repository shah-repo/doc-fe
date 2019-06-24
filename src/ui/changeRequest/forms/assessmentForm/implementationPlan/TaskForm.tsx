import { Form, Formik } from "formik";
import { Button } from "@material-ui/core";
import React from "react";
import InputField from "../../../../components/forms/fields/Input";
import { validator, required, requiredAtLeastOne } from "../../../../components/forms/fields/validators";
import Text from "../../../../components/Text";
import AutocompleteField from "../../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../../components/forms/fields/Autocomplete/types";
import { changeRequestsSelectors } from "../../../../../state/ducks/changeRequest";
import { connect } from "react-redux";
import { ApplicationState } from "../../../../../state/reducers";
import DatePickerField from "../../../../components/forms/fields/DatePicker";

interface OwnProps {
  cancel: () => void;
}

interface StateProps {
  availableAssignees: OptionType[];
}

type TaskFormProps = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  availableAssignees: changeRequestsSelectors.getAssignessList(state),
});

export const TaskForm: React.FunctionComponent<TaskFormProps> = ({
  cancel, availableAssignees
}) => {
  return (
    <Form>
      <InputField
        name="title"
        label="common.title"
        inputProps={{ id: "title" }}
        validate={validator(required)}
      />
      <InputField
        name="description"
        label="common.description"
        inputProps={{ id: "description" }}
        validate={validator(required)}
      />
      <AutocompleteField
        name="assigned"
        autocompleteProps={{
          id: "assigned",
          placeholder: <Text translation="common.assignedTo" />,
          isMulti: true,
        }}
        options={availableAssignees}
        validate={validator(requiredAtLeastOne)}
      />
      <DatePickerField
        name="dueDate"
        label="common.dueDate"
        datePickerProps={{ minDate: new Date() }}
        validate={validator(required)}
      />
      <Button
        type="submit"
        color="primary"
        style={{ float: 'right', clear: 'right' }}
      >
        <Text translation="transition.action.confirm" />
      </Button>
      <Button
        variant="text"
        color="secondary"
        onClick={cancel}
        style={{ float: 'right' }}
      >
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(TaskForm);
