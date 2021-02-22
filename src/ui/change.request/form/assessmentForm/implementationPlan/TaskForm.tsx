import { Button, createStyles, Grid, makeStyles } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import React from "react";
import { connect } from "react-redux";
import { toStartOfDay } from "../../../../../common/utils/date";
import { changeRequestsSelectors } from "../../../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../../../state/reducers";
import AutocompleteField from "../../../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../../../components/forms/fields/Autocomplete/types";
import DatePickerField from "../../../../components/forms/fields/DatePicker";
import InputField from "../../../../components/forms/fields/Input";
import TextEditorField from "../../../../components/forms/fields/RichTextEditor";
import { required, validator } from "../../../../components/forms/fields/validators";
import Text from "../../../../components/Text";
import { ImplementationPlanTaskFormValues } from "../../types";

interface OwnProps extends FormikProps<ImplementationPlanTaskFormValues> {
  cancel: () => void;
}

interface StateProps {
  availableAssignees: OptionType[];
}

export type TaskFormProps = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  availableAssignees: changeRequestsSelectors.getAssignessList(state),
});

const styles = makeStyles(() =>
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
          data-testid="addTask-title"
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
            datePickerProps={{ id: "dueDate", minDate: toStartOfDay(undefined) }}
            validate={validator(required)}
          />
        </Grid>
        <Grid item={true} xs={4}>
          <InputField
            name="status"
            label="common.status"
            inputProps={{
              id: "statusId",
              value: "PENDING",
              disabled: true,
            }}
          />
        </Grid>
      </Grid>
      <Button
        id="confirm"
        type="submit"
        color="primary"
        className={classes.submitBtn}
        variant="contained"
      >
        <Text translation="transition.action.confirm" />
      </Button>
      <Button
        id="cancel"
        variant="outlined"
        color="primary"
        onClick={cancel}
        className={classes.cancelBtn}
      >
        <Text translation="transition.action.cancel" />
      </Button>
    </Form>
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(TaskForm);
