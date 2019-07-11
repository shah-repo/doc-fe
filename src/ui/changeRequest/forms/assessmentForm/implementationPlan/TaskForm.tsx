import { Button, createStyles, makeStyles } from "@material-ui/core";
import { Form } from "formik";
import React from "react";
import { connect } from "react-redux";
import implementationPlanTaskStates from "../../../../../data/implementationPlanTaskStates.json";
import { changeRequestsSelectors } from "../../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../../state/reducers";
import AutocompleteField from "../../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../../components/forms/fields/Autocomplete/types";
import DatePickerField from "../../../../components/forms/fields/DatePicker";
import InputField from "../../../../components/forms/fields/Input";
import SelectField from "../../../../components/forms/fields/Select";
import { required, validator } from "../../../../components/forms/fields/validators";
import Text from "../../../../components/Text";

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

export const styles = makeStyles(() =>
  createStyles({
    submitBtn: {
      float: "right",
      clear: "right",
    },
    cancelBtn: {
      float: "right",
    },
  },
));

export const TaskForm: React.FunctionComponent<TaskFormProps> = ({
  cancel, availableAssignees,
}) => {
  const classes = styles();

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
          isClearable: true,
        }}
        options={availableAssignees}
      />
      <DatePickerField
        name="dueDate"
        label="common.dueDate"
        datePickerProps={{ minDate: new Date() }}
        validate={validator(required)}
      />
      <SelectField
        name="status"
        label="common.status"
        selectProps={{inputProps: { id: "status" }}}
        options={implementationPlanTaskStates}
        validate={validator(required)}
        includeEmpty={false}
      />
      <Button
        type="submit"
        color="primary"
        className={classes.submitBtn}
      >
        <Text translation="transition.action.confirm" />
      </Button>
      <Button
        variant="text"
        color="secondary"
        onClick={cancel}
        className={classes.cancelBtn}
      >
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(TaskForm);
