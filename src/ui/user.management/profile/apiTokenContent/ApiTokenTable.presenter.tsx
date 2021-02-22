import { Button } from "@material-ui/core";
import React from "react";
import { ReactComponent as DisableIcon } from "../../../../assets/images/disable-icon.svg";
import { API_TOKEN, GetApiTokenList } from "../../../../state/ducks/userManagement";
import { TableColumnProps } from "../../../components/table/column/types";
import { TablePanel } from "../../../components/table/panel";
import Text from "../../../components/Text";
import { styles } from "./ApiToken.style";

interface Props {
  tableName: string;
  disableApiToken: (id: string) => void;
}

const ApiTokenTablePresenter: React.FunctionComponent<Props> = ({
  tableName,
  disableApiToken,
}) => {
  const classes = styles();

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
    <TablePanel<GetApiTokenList>
      columns={columns}
      queryUrl={API_TOKEN}
      tableName={tableName}
      cellMeasure={true}
      searchable={false}
      rootCustomStyle={classes.rootCustomStyle}
    />
  );
};

export default ApiTokenTablePresenter;
