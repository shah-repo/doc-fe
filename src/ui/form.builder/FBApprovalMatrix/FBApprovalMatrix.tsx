import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { FormContext } from "../../components/forms/FormContext";
import { FBApprovalMatrixFieldProps, FBApprovalMatrixTableProps } from "./FBApprovalMatrix.types";
import { withFBApprovalMatrix } from "./FBApprovalMatrix.wrap";
import FBApprovalMatrixField from "./FBApprovalMatrixField/FBApprovalMatrixField";

const FBApprovalMatrix: React.FunctionComponent<FBApprovalMatrixFieldProps> = ({
  amState,
  ...props
}) => (
  <Provider {...{ amState }}>
    <Box mb={3}>
      <FormContext.Provider value={{ submitOnChange: false }}>
        <FBApprovalMatrixField {...props as FBApprovalMatrixTableProps} />
      </FormContext.Provider>
    </Box>
  </Provider>
);

export default withFBApprovalMatrix(FBApprovalMatrix);
