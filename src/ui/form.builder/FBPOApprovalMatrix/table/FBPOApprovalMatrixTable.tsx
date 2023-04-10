import { Box, makeStyles } from "@material-ui/core";
import { find, findIndex, isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTableCriteria } from "../../../../common/utils/selectors";
import { tableSearchActions } from "../../../../state/ducks/tableSearch";
import { getSchemaFromColumns } from "../../../common/utils/helpers";
import { KendoColumn } from "../../../components/common/kendo/types";
import { DataStateProps } from "../../../components/KendoGrid/interfaces";
import { KendoGrid } from "../../../components/KendoGrid/KendoGrid";
import { FBPOApprovalMatrixTableProps, POApprovalMatrixLevel, Signature } from "../FBPOApprovalMatrix.types";
import FBPOApprovalMatrixDialog from "../form/FBPOApprovalMatrixDialog";
import gridConfiguration from "../grid/column.definition";
import { withFBPOApprovalMatrixTable } from "./FBPOApprovalMatrixTable.wrap";

const useStyles = makeStyles({
  root: {
    height: "calc(100vh - 400px)",
  },
});

const FBPOApprovalMatrixTable: React.FunctionComponent<FBPOApprovalMatrixTableProps> = ({
  disabled,
  approvalLevels,
  employees,
  groups,
  handleEdit,
  isDocumentReleased,
  isDialogOpen,
  closeDialog,
  initialValues,
  onSubmit,
  name,
  signatureStages,
  groupOptions,
}) => {
  const classes = useStyles();
  const TABLE_NAME = "FBPOApprovalMatrix";
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));

  const getApprovalLevelsData = () => approvalLevels?.map((ele) => ({
    ...ele, signatures: (ele.signatures as Signature[]).reduce((prevVal, currentVal) => {

      const groupNames = currentVal?.groups?.map((group) => groups?.get(group.id)?.name);
      const employeeNames = currentVal?.employees?.map((employee) => employees?.get(employee.id)?.user?.name);
      return { ...prevVal, [`signatureStage${currentVal?.signatureStage}`]: [...groupNames, ...employeeNames] };
    }, {}),
  }));
  const setSearchStatus = (
    dataState: DataStateProps,
    columns: KendoColumn[]
  ) => {
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          ...tableCriteria,
          apiError: "",
          queryDict: {
            dataState,
          },
          columnConfig: JSON.stringify(columns),
        },
        TABLE_NAME
      )
    );
  };

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict)) {
      const dataState: DataStateProps = {
        filter: {
          logic: "and",
          filters: [

          ],
        },
        sort: [],
        skip: 0,
        take: 25,
        group: [],
      };
      setSearchStatus(
        dataState,
        gridConfiguration.columns,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict]);


  return (
    <Box className={classes.root}>
      <KendoGrid
        {...{ approvalLevels: getApprovalLevelsData() }}
        tableName={TABLE_NAME}
        className={classes.root}
        defaultPayloadData={{}}
        schema={schema}
        tableCriteria={tableCriteria}
        queryUrl={""}
        onRowClick={({ dataItem }) => {
          const { id } = dataItem;
          const index = findIndex(approvalLevels, { id });
          const item = find(approvalLevels, { id } );
          handleEdit(index, item as POApprovalMatrixLevel);
        }}
        exportDataChanges={() => ({})}
      />
      {
        !isDocumentReleased && isDialogOpen &&
        <FBPOApprovalMatrixDialog
          {...{
            isDialogOpen,
            closeDialog,
            initialValues,
            onSubmit,
            name,
            groupOptions,
            employees,
            signatureStages,
          }}
        />
      }
    </Box>
  );
};

export default withFBPOApprovalMatrixTable(FBPOApprovalMatrixTable);
