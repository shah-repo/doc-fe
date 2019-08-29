import { Button, createStyles, Grid, makeStyles, Paper } from "@material-ui/core";
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
import TextEditorField from "../../../../components/forms/fields/TextEditor";
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
        size="sm"
        label="common.title"
        inputProps={{ id: "title" }}
        validate={validator(required)}
      />
      <div className="task-description">
        <TextEditorField
          name="description"
          size="sm"
          label="common.description"
          validate={validator(required)}
        />
      </div>
      <Grid container={true} spacing={3}>
      <Grid item={true} xs={4}>
        <AutocompleteField
          name="assigned"
          size="sm"
          label="common.assigned.to"
          autocompleteProps={{ id: "assigned", isClearable: true }}
          options={availableAssignees}
        />
        </Grid>
        <Grid item={true} xs={4}>
          <DatePickerField
            name="dueDate"
            label="common.due.date"
            size="sm"
            datePickerProps={{ minDate: new Date() }}
            validate={validator(required)}
          />
        </Grid>
        <Grid item={true} xs={4}>
          <SelectField
            name="status"
            label="common.status"
            size="sm"
            selectProps={{inputProps: { id: "status" }}}
            options={implementationPlanTaskStates}
            validate={validator(required)}
            includeEmpty={false}
          />
        </Grid>
      </Grid>
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
