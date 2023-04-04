import React from "react";
import Grid from "./components/Grid";
import { withFBApprovalMatrix } from "./wrap";
import { FBApprovalMatrixProps } from "./types";

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = (props) => {
  const { data } = props;

  return (
    <Grid
      data={data}
    />
  );
};

export default withFBApprovalMatrix(FBApprovalMatrix);
