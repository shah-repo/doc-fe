import { Grid } from "@material-ui/core";
import { default as React } from "react";
import { stripTagsFromObject } from "../../../common/utils/helpers";
import { CHANGE_REQUEST_ROOT_URL } from "../../../state/ducks/changeRequest/constants";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import FromListContainer from "../form.list/FormList.container";
import gridConfiguration from "./column.definition";
import { KendoPanel } from "./KendoPanel";
import KendoGridStyles from "./styles";

const KendoGridList: React.FunctionComponent<any> = ({
  currentUserEmail,
  tableName,
  tableCriteria,
  data,
  statuses,
}) => {
  const classes = KendoGridStyles();
  const headers = [
    { label: `AR ID: ${tableCriteria.queryDict?.crId || ""}`, key: "crId" },
    {
      label: `AR TITLE: ${tableCriteria.queryDict?.title || ""}`,
      key: "title",
    },
    { label: `OWNER: ${tableCriteria.queryDict?.owner || ""}`, key: "owner" },
    { label: `STATUS: ${tableCriteria.queryDict?.state || ""}`, key: "state" },
  ];
  const customDataSet = (data: ChangeRequest[]) =>
    data.map((cr) => stripTagsFromObject(cr));

  return (
    <Grid container={true} className={classes.root}>
      <FromListContainer {...{ headers, tableData: data }} />
      <Grid item={true} xs={12}>
        <KendoPanel<ChangeRequest>
          columns={gridConfiguration}
          cellMeasure={true}
          queryUrl={CHANGE_REQUEST_ROOT_URL}
          customDataSet={customDataSet}
          tableName={tableName}
          tableCriteria={tableCriteria}
          sortBy={"crId"}
          data={data}
          headers={headers}
          statuses={statuses}
          currentUserEmail={currentUserEmail}
        />
      </Grid>
    </Grid>
  );
};

export default KendoGridList;
