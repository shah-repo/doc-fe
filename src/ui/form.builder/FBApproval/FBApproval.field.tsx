import { Box } from "@material-ui/core";
import React from "react";
import { FBApprovalFieldProps } from ".";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import FBButton from "../components/inputs/FBButton";
import { FBMapWrapper } from "../FBMapWrapper";

const FBApprovalField = <T extends Employee | GroupRequestBody>({
  approvalConfig,
  collection,
  disabled,
  onApprove,
  mt,
}: FBApprovalFieldProps<T>) => (
  <Box {...{ mt }}>
    <FBMapWrapper<T> {...{ collection }}>
      {(approver, index) => {
        const config = approvalConfig && approvalConfig(approver);
        return (
          <Box
            mb={config?.canApprove ? 1 : 2}
            key={`fb-approver-${index}`}
            display="flex"
            alignItems="center"
            fontSize="default"
          >
            <Box flexGrow={1} color="rgb(69, 69, 69)" fontWeight="fontWeightMedium">
              {config?.label}
              <Box component="span" ml={0.6} color="rgb(164, 177, 189)">
                {config?.status}
              </Box>
            </Box>
            {config?.canApprove && (
              <FBButton
                label="form.builder.approve"
                variant="outlined"
                onClick={onApprove && onApprove(approver)}
                size="small"
                style={{ margin: "5px 0 0 10px" }}
                {...{ disabled }}
              />
            )}
          </Box>
        );
      }}
    </FBMapWrapper>
  </Box>
);

export default FBApprovalField;
