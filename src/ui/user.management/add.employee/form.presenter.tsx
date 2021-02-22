import { Box, Button, Grid } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { GetEmployeeResponse, userManagementActions } from "../../../state/ducks/userManagement";
import { AsyncState, AsyncStatus } from "../../../state/types";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import Text from "../../components/Text";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { AddEmployeeFormValues } from "./form.container";

interface Props extends FormikProps<AddEmployeeFormValues> {
  asyncState: AsyncState;
  groupOptions: OptionType[];
}

const AddEmployeeFormPresenter: React.FunctionComponent<Props> = ({
  asyncState,
  groupOptions,
  resetForm,
  values,
  setFieldValue,
}) => {
  const [isNameDisabled, setIsNameDisabled] = useState(false);
  useEffect(() => {
    // this shouldn't be here
    // couldn't find a better way to reset form, because of useAsync limitations
    // form submit needs refactoring or maybe this could be handled with formik hooks
    if (asyncState.status === AsyncStatus.Success) {
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncState]);
  const getEmployeeAction = useActionCreator(userManagementActions.getEmployee);
  const asyncName = useAsync<GetEmployeeResponse[]>({
    onSuccess: (data: GetEmployeeResponse[] = []) => {
      if (data.length === 0) {
        setIsNameDisabled(false);
        setFieldValue("id", null);
        return;
      }

      setIsNameDisabled(true);
      setFieldValue("name", data[0].user.name);
      setFieldValue("id", data[0].user.id);
    },
  });
  const handleEmailChange = (value: string) => {
    const hasErrors = email(value);

    if (hasErrors) {
      setIsNameDisabled(false);
      setFieldValue("id", null);
      return;
    }
    asyncName.start(getEmployeeAction, { email: value }, asyncName );
  };
  const [debouncedEmail] = useDebounce(values.email, 300);

  useEffect(() => {
    handleEmailChange(values.email);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail]);

  return (
    <Form>
      <FormMessage asyncState={asyncState} />
      <FormProgress asyncState={asyncState} />
      <InputField
        name="email"
        label="common.email"
        inputProps={{
          id: "AddEmployeeFormPresenter-commonEmail",
        }}
        validate={validator(required, email)}
      />
      <InputField
        name="name"
        label="common.name"
        inputProps={{ id: "AddEmployeeFormPresenter-commonName", disabled: isNameDisabled }}
        validate={validator(required)}
      />
      <AutocompleteField
        name="groups"
        label="common.groups"
        autocompleteProps={{
          id: "approvals",
          isMulti: true,
          isClearable: true,
        }}
        options={groupOptions}
      />
      <Box mt={5}>
        <Grid
          container={true}
          alignItems="flex-start"
          justify="flex-end"
          direction="row"
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => resetForm()}
            id="AddEmployeeFormPresenter-resetForm"
          >
            <Text translation="common.reset" />
          </Button>
          <SubmitButton
            asyncState={asyncState}
            label={"common.save"}
            id="AddEmployeeFormPresenter-submitForm"
          />
        </Grid>
      </Box>
    </Form>
  );
};

export default AddEmployeeFormPresenter;
