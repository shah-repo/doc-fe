import { Dialog } from "@material-ui/core";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { getTableCriteria } from "../../../common/utils/selectors";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { TRAINING_RECORDS_SEARCH_URL } from "../../../state/ducks/training/constants";
import { DEFAULT_TRAINING_RECORD_QUERY, TrainingRecordQuery } from "../../../state/ducks/training/types";
import { getSchemaFromColumns } from "../../common/utils/helpers";
import { KendoColumn } from "../../components/common/kendo/types";
import { DataStateProps } from "../../components/KendoGrid/interfaces";
import useDialog from "../../hooks/useDialog";
import TrainingDetails from "../details/TrainingDetails";
import gridConfiguration from "./column.definition";
import { TrainingListPresenter } from "./presenter";
import KendoGridStyles from "./presenter.styles";

const TrainingListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  const TABLE_NAME = "training";
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const dispatch = useDispatch();
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const classes = KendoGridStyles();

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
          columnConfig: JSON.stringify(gridConfiguration.columns),
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
          filters: [],
        },
        sort: [],
        skip: 0,
        take: 25,
        group: [],
      };
      setSearchStatus(
        dataState,
        gridConfiguration.columns
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableCriteria.queryDict]);

  const trainingDetailsDialog = useDialog();
  const [training, setTraining] = useState<TrainingRecordQuery>(
    DEFAULT_TRAINING_RECORD_QUERY
  );

  const onRowClick = (rowData: { dataItem: TrainingRecordQuery }) => {
    trainingDetailsDialog.open();
    setTraining(rowData.dataItem);
  };

  return (
    <>
      <TrainingListPresenter
        tableName={TABLE_NAME}
        tableCriteria={tableCriteria}
        schema={schema}
        columns={gridConfiguration.columns}
        onRowClick={onRowClick}
        queryUrl={TRAINING_RECORDS_SEARCH_URL}
        defaultPayloadData={{}}
      />
      {trainingDetailsDialog.isOpen && (
        <Dialog
          open={trainingDetailsDialog.isOpen}
          classes={{ paper: classes.dialogContent }}
          fullWidth
          maxWidth="md"
        >
          <TrainingDetails
            dialog={trainingDetailsDialog}
            training={training}
          />
        </Dialog>
      )}
    </>
  );
};

export default TrainingListContainer;
