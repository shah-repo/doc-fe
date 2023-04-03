import React from "react";
import { useSelector } from "react-redux";
import { getTableCriteria } from "../../../../../common/utils/selectors";
import { getSchemaFromColumns } from "../../../../common/utils/helpers";
import gridConfiguration from "./configuration";
import GridPresenter from "./presenter";
import { MATRIX_TABLE_NAME } from "./constants";
import { useObserver } from "mobx-react";
import { FBApprovalMatrixFieldData } from "../../../FBApprovalMatrixField/FBApprovalMatrixField.types";
import { FB, FBDAMFields } from "../../../index";
import { get, has } from "lodash";

const GridContainer: React.FC = () => {
  const schema = getSchemaFromColumns(gridConfiguration.columns);
  const tableCriteria = useSelector(getTableCriteria(MATRIX_TABLE_NAME));

  const { approvalMatrixFieldState, workspaceState } = FB.useStores();
  const { formInput } = workspaceState || {};
  const approvalRoles = get(formInput, FBDAMFields.DAR, []);
  const formInputDAM = get(formInput, FBDAMFields.DAM, []);
  const isDAMInNewFormat = has(formInputDAM, "approvalMatrix");
  const approvalMatrix = isDAMInNewFormat ? formInputDAM.approvalMatrix : formInputDAM;

  const data = useObserver(() => ({
    ...approvalMatrixFieldState?.data as FBApprovalMatrixFieldData,
    approvalMatrix,
    approvalRoles,
  }));

  return (
    <GridPresenter
      tableName={MATRIX_TABLE_NAME}
      schema={schema}
      tableCriteria={tableCriteria}
      defaultPayloadData={data}
    />
  );
};

export default GridContainer;
