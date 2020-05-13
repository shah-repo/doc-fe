import { Box, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import { Dictionary } from "lodash";
import React from "react";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../../components/Text";
import { toMembersOptions } from "../../../group.management/utils/transform";
import FBButton from "../../components/inputs/FBButton";
import FBTextField from "../../components/inputs/FBTextField";
import { FBPOApprovalMatrixFormProps } from "../FBPOApprovalMatrix.types";
import { default as Error } from "./FBPOApprovalMatrixError";
import { withFBPOApprovalMatrixForm } from "./FBPOApprovalMatrixForm.wrap";


const FBPOApprovalMatrixForm: React.FunctionComponent<FBPOApprovalMatrixFormProps> = ({
  initialValues = {} as Dictionary<any>,
  onSubmit,
  closeDialog,
  name,
  validateForm,
  employees,
  groupOptions,
  signatureStages,
}) => {
  const renderForm = (props) => {
    const { errors } = props;
    return (
      <Form>
        <FBTextField
          label="form.builder.field.level.name"
          name={`${name}-formValues.name`}
        />
        <Error error={errors.name} />
        <FBTextField
          label="form.builder.field.limit"
          name={`${name}-formValues.limit`}
        />
        <Error error={errors.limit} />
        {signatureStages?.map((level) => (
          <Box key={level} borderTop="1px solid lightgray">
            <Typography variant="h6" style={{ paddingTop: 20 }}>
              <Text message={`Signature ${level}`}/>
            </Typography>
            <AutocompleteField
              name={`${name}-formValues.signature${level}.groups`}
              label="document.revision.selected.groups"
              options={groupOptions}
              autocompleteProps={{
                isMulti: true,
                isClearable: true,
                defaultValue: props.values[`${name}-formValues`][`signature${level}.groups`],
              }}
            />
            <AutocompleteField
              name={`${name}-formValues.signature${level}.employees`}
              label="document.revision.selected.users"
              options={toMembersOptions(employees)}
              autocompleteProps={{
                isMulti: true,
                isClearable: true,
                defaultValue: props.values[`${name}-formValues`][`signature${level}.employees`],
              }}
            />
          </Box>) )}
        <Box textAlign="right">
          <FBButton
            variant="outlined"
            onClick={closeDialog}
            label="common.cancel"
          />
          <FBButton
            buttonType="submit"
            label="common.done"
          />
        </Box>
      </Form>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateForm}
      validateOnChange
    >
      {renderForm}
    </Formik>
  );
};

export default withFBPOApprovalMatrixForm(FBPOApprovalMatrixForm);
