import { Box, Button, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as DisableIcon } from "../../../../assets/images/disable-icon.svg";
import { getTableData } from "../../../../common/utils/selectors";
import { tableSearchActions } from "../../../../state/ducks/tableSearch";
import { ApiTokenData, GetApiTokenList, userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import { API_TOKEN_LIST_URL } from "../../../../state/ducks/userManagement/constants";
import InputField from "../../../components/forms/fields/Input";
import { required, validator } from "../../../components/forms/fields/validators";
import { TableColumnProps } from "../../../components/table/column/types";
import { TablePanel } from "../../../components/table/panel";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { styles } from "./ApiToken.style";
import ApiTokenDialog from "./ApiTokenDialog";

export const ApiTokenContent: React.FunctionComponent = () => {
  const classes = styles();

  const dialog = useDialog();
  const openDialog = () => dialog.open();

  const renderForm = () => (
    <Form>
      <Box style={{
        display: "flex",
      }}>
        <Box className={classes.inputField}>
          <InputField
            type="text"
            name="name"
            inputProps={{ placeholder: "Enter Token Name", id: "ApiTokenContent-name" }}
            validate={validator(required)}
          />
        </Box>
        <Box style={{ paddingTop: 9 }}>
          <Button
            id="ApiTokenContent-generate"
            type="submit"
            color="primary"
            variant="contained"
          >
            <Text translation="user.management.generate.key" />
          </Button>
        </Box>
      </Box>
    </Form>
  );
  const TABLE_NAME = "apiTokens";
  const updateTable = useActionCreator(tableSearchActions.setForceUpdate);

  const async = useAsync({
    onSuccess: () => {
      openDialog();
      updateTable(TABLE_NAME, true);
    },
  });
  const generateAction = useActionCreator(userManagementActions.generateApiToken);
  const revokeApiToken = useActionCreator(userManagementActions.revokeApiToken);
  const apiToken = useSelector(userManagementSelectors.apiToken);
  const tableData = useSelector(getTableData(TABLE_NAME));
  const resetTableData = useActionCreator(tableSearchActions.setData);

  const generateKey = (values: ApiTokenData) => {
    async.start(generateAction, { name: values.name }, async);
  };

  const initialValues = {
    name: "",
  };

  const renderInputForm = () => (
    <Formik
      onSubmit={generateKey}
      initialValues={initialValues}
    >
      {renderForm}
    </Formik>
  );

  const [newTableData, setNewTableData] = useState({});

  const asyncDeleteToken = useAsync({
    onSuccess: () => {
      resetTableData(newTableData, TABLE_NAME);
    },
  });

  const disableApiToken = (tokenKey) => {
    asyncDeleteToken.start(revokeApiToken, tokenKey, asyncDeleteToken);
    const data = tableData.filter((obj) => obj.id !== tokenKey);
    setNewTableData(data);
  };

  const columns: TableColumnProps<GetApiTokenList>[] = [
    {
      key: "name",
      id: "ApiTokenContent-name",
      label: "common.token.name",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.name,
      },
      omitSearch: true,
    },
    {
      key: "id" as keyof GetApiTokenList,
      id: "ApiTokenContent-id",
      label: "common.token.key",
      columnOptions: {
        cellDataGetter: ({ rowData }) => rowData.id,
      },
      omitSearch: true,
    },
    {
      key: "active",
      id: "ApiTokenContent-active",
      label: "common.token.action",
      columnOptions: {
        cellDataGetter: ({ rowData }) => {
          if (rowData.active) {
            return (
              <Button
                style={{ margin: 0, padding: 0 }}
                color="primary"
                onClick={() => disableApiToken(rowData.id)}
              >
                <DisableIcon style={{ paddingRight: 5 }} />
                <Text translation="common.disable" />
              </Button>
            );
          }
          return rowData.active;
        },
      },
      omitSearch: true,
    },
  ];

  return (
    <>
      <Typography variant="h6" style={{ marginBottom: 15 }}>
        <Text translation="user.management.api.token" />
      </Typography>
      {renderInputForm()}
      <ApiTokenDialog
        dialog={dialog}
        apiTokenKey={apiToken.id}
        apiTokenName={apiToken.name}
        apiTokenSecret={apiToken.secretKey}
      />
      <TablePanel<GetApiTokenList>
        columns={columns}
        queryUrl={API_TOKEN_LIST_URL}
        tableName={TABLE_NAME}
        cellMeasure={true}
        searchable={false}
        headerStyle={classes.header}
      />
    </>
  );
};

export default ApiTokenContent;
