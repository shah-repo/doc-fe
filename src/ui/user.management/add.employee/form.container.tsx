import { Formik, FormikProps } from "formik";
import React from "react";
import { userManagementActions } from "../../../state/ducks/userManagement";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import AddEmployeeFormPresenter from "./form.presenter";

export interface AddEmployeeFormValues {
  name: string;
  email: string;
  groups: string[];
}

interface Props {
}

const initialValues = {
  name: "",
  email: "",
  groups: [],
};

export const AddEmployeeFormContainer: React.FunctionComponent<Props> = ({
}) => {
  const addEmployeeAction = useActionCreator(userManagementActions.addEmployee);
  const async = useAsync();
  const onSubmit = (values: AddEmployeeFormValues) => {
    async.start(addEmployeeAction, values, async);
  };

  const renderForm = (props: FormikProps<AddEmployeeFormValues>) => {
    return (
      <AddEmployeeFormPresenter
        {...props}
        asyncState={async.asyncState}
      />
    );
  };

  return (
    <Formik
      render={renderForm}
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    />
  );
};

export default AddEmployeeFormContainer;
