import { Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getTableData } from "../../../../common/utils/selectors";
import { tableSearchActions } from "../../../../state/ducks/tableSearch";
import { userManagementActions } from "../../../../state/ducks/userManagement";
import { ApiTokenData, ApiTokenState, GetApiTokenList } from "../../../../state/ducks/userManagement/types";
import { FormContext } from "../../../components/forms/FormContext";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import ApiTokenDialog from "./ApiTokenDialog";
import ApiTokenTablePresenter from "./ApiTokenTable.presenter";
import GenerateTokenFormPresenter from "./GenerateTokenForm.presenter";

const ApiTokenContent: React.FunctionComponent = () => {
  const dialog = useDialog();
  const openDialog = () => dialog.open();

  const TABLE_NAME = "apiTokens";

  const async = useAsync({
    onSuccess: (data: ApiTokenState = { id: "", name: "", secretKey: "" }) => {
      setApiToken(data);
      openDialog();
      resetTableData(
        [
          data,
          ...tableData,
        ],
        TABLE_NAME,
      );
    },
  });

  const asyncDeleteToken = useAsync({
    onSuccess: (deletedToken: GetApiTokenList = { id: "", name: "", active: true }) => {
      resetTableData(
        [
          ...tableData.filter((obj) => obj.id !== deletedToken.id),
        ],
        TABLE_NAME,
      );
    },
  });

  const generateAction = useActionCreator(userManagementActions.generateApiToken);
  const [apiToken, setApiToken] = useState<ApiTokenState>({ id: "", name: "", secretKey: "" });
  const revokeApiToken = useActionCreator(userManagementActions.revokeApiToken);
  const resetTableData = useActionCreator(tableSearchActions.setData);

  const tableData = useSelector(getTableData(TABLE_NAME));

  const generateKey = (values: ApiTokenData) => {
    async.start(generateAction, { name: values.name }, async);
  };

  const disableApiToken = (tokenKey) => {
    asyncDeleteToken.start(revokeApiToken, tokenKey, asyncDeleteToken);
  };

  const initialValues = {
    name: "",
  };

  const renderForm = () => (
    <Form>
      <GenerateTokenFormPresenter />
    </Form>
  );

  return (
    <>
      <Typography variant="h6" style={{ marginBottom: 15, marginTop: 15 }}>
        <Text translation="user.management.api.token" />
      </Typography>
      <FormContext.Provider value={{ submitOnChange: false }}>
        <Formik
          onSubmit={generateKey}
          initialValues={initialValues}
        >
          {renderForm}
        </Formik>
      </FormContext.Provider>
      <ApiTokenDialog
        dialog={dialog}
        apiTokenKey={apiToken.id}
        apiTokenName={apiToken.name}
        apiTokenSecret={apiToken.secretKey}
      />
      <ApiTokenTablePresenter
        tableName={TABLE_NAME}
        disableApiToken={disableApiToken}
      />
    </>
  );
};

export default ApiTokenContent;
