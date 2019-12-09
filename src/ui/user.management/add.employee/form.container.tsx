import { Box } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import AddEmployeeFormPresenter from "./form.presenter";

export interface AddEmployeeFormValues {
  name: string;
  email: string;
  groups: string[];
}

const initialValues = {
  name: "",
  email: "",
  groups: [],
};

export const AddEmployeeFormContainer: React.FunctionComponent = ({
}) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const addEmployeeAction = useActionCreator(userManagementActions.addEmployee);
  const async = useAsync();
  const onSubmit = (values: AddEmployeeFormValues) => {
    async.start(addEmployeeAction, values, async);
  };

  const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  };
  const debouncedHandleEmailChange = _.debounce(handleEmailChange, 300);

  const renderForm = (props: FormikProps<AddEmployeeFormValues>) => {
    return (
      <AddEmployeeFormPresenter
        {...props}
        asyncState={async.asyncState}
        groupOptions={groupOptions}
        handleEmailChange={debouncedHandleEmailChange}
      />
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      width="100%"
      height="100%"
    >
      <Formik
        render={renderForm}
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
      />
    </Box>
  );
};

export default AddEmployeeFormContainer;
