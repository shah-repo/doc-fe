import { Box, Grid } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getTableCriteria } from "../../../common/utils/selectors";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { userManagementActions, userManagementSelectors } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import AddEmployeeFormPresenter from "./form.presenter";
import { transformToAddEmployeeRequest } from "./utils/transform";

export interface AddEmployeeFormValues {
  id?: string;
  name: string;
  email: string;
  groups: OptionType[];
}

const initialValues = {
  name: "",
  email: "",
  groups: [],
};

export const AddEmployeeFormContainer: React.FunctionComponent = () => {
  const TABLE_NAME = "userManagement";
  const dispatch = useDispatch();
  const history = useHistory();

  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const defaultGroups = useSelector(userManagementSelectors.getDefaultGroups);
  const addEmployeeAction = useActionCreator(userManagementActions.addEmployee);
  const async = useAsync({
    onSuccess: () => {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              active: true,
            },
          },
          TABLE_NAME,
        ),
      );
    },
  });


  const onSubmit = (values: AddEmployeeFormValues) => {
    async.start(addEmployeeAction, transformToAddEmployeeRequest(values), async);
  };

  // this is a hack for back button to redirect to user management table
  useEffect(() => () => {
    history.goForward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderForm = (props: FormikProps<AddEmployeeFormValues>) => (
    <AddEmployeeFormPresenter
      {...props}
      asyncState={async.asyncState}
      groupOptions={groupOptions}
      defaultGroups={defaultGroups}
    />
  );

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
