import { Box, Grid } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import React from "react";
import { AsyncState } from "../../../state/types";
import AutocompleteField from "../../components/forms/fields/Autocomplete/Autocomplete";
import InputField from "../../components/forms/fields/Input";
import { email, required, validator } from "../../components/forms/fields/validators";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import SubmitButton from "../../components/forms/SubmitButton";
import { AddEmployeeFormValues } from "./form.container";

interface Props extends FormikProps<AddEmployeeFormValues> {
  asyncState: AsyncState;
}

export const AddEmployeeFormPresenter: React.FunctionComponent<Props> = ({
  asyncState,
}) => {
  return (
    <Form>
      <FormMessage asyncState={asyncState} />
      <FormProgress asyncState={asyncState} />
      <InputField
        name="email"
        label="common.email"
        inputProps={{ id: "email" }}
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
        options={[]}
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

/*
*/
