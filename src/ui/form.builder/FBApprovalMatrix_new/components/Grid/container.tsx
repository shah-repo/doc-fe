import React from "react";
import GridPresenter from "./presenter";
import { useObserver } from "mobx-react";
import { FBApprovalMatrixFieldData } from "../../../FBApprovalMatrixField/FBApprovalMatrixField.types";
import { FB, FBDAMFields } from "../../../index";
import { get, has } from "lodash";

const GridContainer: React.FC = () => {
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
      data={data.approvalMatrix}
    />
  );
};

export default GridContainer;
