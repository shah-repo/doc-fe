import { Box, Grid } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { AsyncState, AsyncStatus } from "../../../state/types";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import { AddEmployeeFormValues } from "./form.container";
import useAsync from "../../hooks/useAsync";
import { userManagementActions, GetEmployeeResponse } from "../../../state/ducks/userManagement";
import useActionCreator from "../../hooks/useActionCreator";

interface Props extends FormikProps<AddEmployeeFormValues> {
  asyncState: AsyncState;
  groupOptions: OptionType[];
}

export const AddEmployeeFormPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  groupOptions,
  resetForm,
  values,
  setFieldValue,
}) => {
  useEffect(() => {
    // this shouldn't be here
    // couldn't find a better way to reset form, because of useAsync limitations
    // form submit needs refactoring or maybe this could be handled with formik hooks
    if (asyncState.status === AsyncStatus.Success) {
      resetForm();
    }
  }, [asyncState]);
  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncName = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      if (data.length === 0) {
        return;
      }

      setFieldValue("name", data[0].user.name);
    },
  });
  const handleEmailChange = (value: string) => {
    const hasErrors = email(value);

    if (hasErrors) {
      return;
    }
    asyncName.start(getEmployeeAction, { email: value }, asyncName );
  };
  const [debouncedEmail] = useDebounce(values.email, 300);

  useEffect(() => {
    handleEmailChange(values.email);
  }, [debouncedEmail]);

  return (
    <Form>
      <FormMessage asyncState={asyncState} />
      <FormProgress asyncState={asyncState} />
      <InputField
        name="email"
        label="common.email"
        inputProps={{
          id: "email",
        }}
        validate={validator(required, email)}
      />
      <InputField
        name="name"
        label="common.name"
        inputProps={{ id: "name" }}
        validate={validator(required)}
      />
      <AutocompleteField
        name="groups"
        label="common.groups"
        autocompleteProps={{ id: "groups", isClearable: true }}
        options={groupOptions}
      />
      <Box mt={5}>
        <Grid
          container={true}
          alignItems="flex-end"
          direction="column"
        >
          <SubmitButton
            asyncState={asyncState}
            label={"common.save"}
          />
        </Grid>
      </Box>
    </Form>
  );
};

export default AddEmployeeFormPresenter;
