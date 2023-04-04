import React from "react";
import { withFBApprovalMatrix } from "./FBApprovalMatrix.wrap";
import { FBApprovalMatrixProps } from "./FBApprovalMatrix.types";
import FBApprovalMatrixGrid from "./components/Grid";

const FBApprovalMatrix: React.FC<FBApprovalMatrixProps> = () => (
  <FBApprovalMatrixGrid />
);

export default withFBApprovalMatrix(FBApprovalMatrix);
