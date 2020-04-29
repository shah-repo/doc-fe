import { Box, IconButton, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { FBApprovalFieldProps } from ".";
import { Employee } from "../../../state/ducks/company";
import { GroupRequestBody } from "../../../state/ducks/groupManagement";
import Text from "../../components/Text";
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
          <Box key={`fb-approver-${index}`} display="flex" alignItems="center">
            {config?.isVisible && (
              <Box flexGrow={1} color="rgb(69, 69, 69)" fontWeight="fontWeightBold">
                {config?.label}
                <Box component="span" ml={0.6} color="rgb(164, 177, 189)">
                  {config?.status}
                </Box>
              </Box>
            )}
            {config?.canApprove && (
              <IconButton
                onClick={onApprove && onApprove(approver)}
                color="primary"
                edge={false}
                size="small"
                {...{ disabled }}
              >
                <Tooltip title={<Text message="form.builder.approve" />}>
                  <AddIcon />
                </Tooltip>
              </IconButton>
            )}
          </Box>
        );
      }}
    </FBMapWrapper>
  </Box>
);

export default FBApprovalField;
