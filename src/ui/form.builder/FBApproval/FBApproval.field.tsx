import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBApprovalFieldProps, FBButton, FBInlineApproverType, FBMapWrapper } from "..";

const FBApprovalField = <T extends FBInlineApproverType>({
  approvalConfig,
  onApprove,
  collection,
  disabled,
  approveLoading,
}: FBApprovalFieldProps<T>) => (
  <Box mt={2}>
    <FBMapWrapper<T> {...{ collection }}>
      {(approver, index) => {
        const config = approvalConfig?.(approver);
        return (
          <Box
            mb={config?.canApprove ? 1 : 2}
            key={`fb-approver-${approver.id}-${index}`}
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
              <>
                {approveLoading && <CircularProgress size={20} />}
                {!approveLoading && (
                  <FBButton
                    label="form.builder.approve"
                    variant="outlined"
                    onClick={onApprove?.(approver)}
                    size="small"
                    style={{ margin: "5px 0 0 10px" }}
                    {...{ disabled }}
                  />
                )}
              </>
            )}
          </Box>
        );
      }}
    </FBMapWrapper>
  </Box>
);

export default FBApprovalField;
