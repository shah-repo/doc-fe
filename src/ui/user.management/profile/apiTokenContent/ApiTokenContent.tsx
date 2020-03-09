import { Button, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as DisableIcon } from "../../../../assets/images/disable-icon.svg";
import { getTableData } from "../../../../common/utils/selectors";
import { tableSearchActions } from "../../../../state/ducks/tableSearch";
import { ApiTokenData, GetApiTokenList, userManagementActions, userManagementSelectors } from "../../../../state/ducks/userManagement";
import { API_TOKEN } from "../../../../state/ducks/userManagement/constants";
import { TableColumnProps } from "../../../components/table/column/types";
import { TablePanel } from "../../../components/table/panel";
import Text from "../../../components/Text";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useDialog from "../../../hooks/useDialog";
import { styles } from "./ApiToken.style";
import ApiTokenDialog from "./ApiTokenDialog";
import GenerateTokenFormPresenter from "./GenerateTokenForm.presenter";

export const ApiTokenContent: React.FunctionComponent = () => {
  const classes = styles();

  const dialog = useDialog();
  const openDialog = () => dialog.open();

  const TABLE_NAME = "apiTokens";
  const updateTable = useActionCreator(tableSearchActions.setForceUpdate);
  const [newTableData, setNewTableData] = useState({});

  const async = useAsync({
    onSuccess: () => {
      openDialog();
      updateTable(TABLE_NAME, true);
    },
  });

  const asyncDeleteToken = useAsync({
    onSuccess: () => {
      resetTableData(newTableData, TABLE_NAME);
    },
  });

  const generateAction = useActionCreator(userManagementActions.generateApiToken);
  const revokeApiToken = useActionCreator(userManagementActions.revokeApiToken);
  const resetTableData = useActionCreator(tableSearchActions.setData);

  const apiToken = useSelector(userManagementSelectors.apiToken);
  const tableData = useSelector(getTableData(TABLE_NAME));

  const generateKey = (values: ApiTokenData) => {
    async.start(generateAction, { name: values.name }, async);
  };

  const disableApiToken = (tokenKey) => {
    asyncDeleteToken.start(revokeApiToken, tokenKey, asyncDeleteToken);
    const data = tableData.filter((obj) => obj.id !== tokenKey);
    setNewTableData(data);
  };

  const initialValues = {
    name: "",
  };

  const renderForm = () => (
    <Form>
      <GenerateTokenFormPresenter />
    </Form>
  );

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
      <Typography variant="h6" style={{ marginBottom: 15, marginTop: 15 }}>
        <Text translation="user.management.api.token" />
      </Typography>
      <Formik
        onSubmit={generateKey}
        initialValues={initialValues}
      >
        {renderForm}
      </Formik>
      <ApiTokenDialog
        dialog={dialog}
        apiTokenKey={apiToken.id}
        apiTokenName={apiToken.name}
        apiTokenSecret={apiToken.secretKey}
      />
      <TablePanel<GetApiTokenList>
        columns={columns}
        queryUrl={API_TOKEN}
        tableName={TABLE_NAME}
        cellMeasure={true}
        searchable={false}
        rootCustomStyle={classes.rootCustomStyle}
      />
    </>
  );
};

export default ApiTokenContent;
