import { Box, Grid } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTableState } from "../../../common/utils/selectors";
import { Nullable } from "../../../state/ducks/common";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import AddEmployeeFormPresenter from "./form.presenter";
import { transformToAddEmployeeRequest } from "./utils/transform";

export interface AddEmployeeFormValues {
  id: Nullable<string>;
  name: string;
  email: string;
  groups: OptionType[];
}

const initialValues = {
  id: null,
  name: "",
  email: "",
  groups: [],
};

export const AddEmployeeFormContainer: React.FunctionComponent = ({
}) => {
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const addEmployeeAction = useActionCreator(userManagementActions.addEmployee);
  const async = useAsync();
  const dispatch = useDispatch();
  const TABLE_NAME = "userManagement";
  const tableState = useSelector(getTableState(TABLE_NAME));
  const onSubmit = (values: AddEmployeeFormValues) => {
    async.start(addEmployeeAction, transformToAddEmployeeRequest(values), async);
    dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableState,
            queryDict: {
              active: true,
            },
          },
          TABLE_NAME,
        ),
      );
  };

  const renderForm = (props: FormikProps<AddEmployeeFormValues>) => {
    return (
      <AddEmployeeFormPresenter
        {...props}
        asyncState={async.asyncState}
        groupOptions={groupOptions}
      />
    );
  };

  return (
    <Grid
      container={true}
      alignItems="center"
      justify="center"
    >
      <Box
        width="50vw"
        paddingTop={10}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {renderForm}
        </Formik>
      </Box>
    </Grid>
  );
};

export default AddEmployeeFormContainer;
