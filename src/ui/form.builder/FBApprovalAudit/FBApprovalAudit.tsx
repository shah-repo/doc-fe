import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBApprovalAuditProps, FBAuditData, FBMapWrapper } from "..";
import { withFBApprovalAudit } from "./FBApprovalAudit.wrap";

const FBApprovalAudit: React.FunctionComponent<FBApprovalAuditProps> = ({
  audits,
  loading,
  ...props
}) =>  (
  <>
    {loading && (
      <Box display="flex" alignContent="center">
        <CircularProgress size={16} />
      </Box>
    )}
    {!loading && audits && (
      <FBMapWrapper<FBAuditData[]> collection={audits}>
        {(change: FBAuditData, index) => (
          <Box mb={2} key={`fb-approval-audit-${change.id}-${index}`} display="flex" alignItems="center">
            <Box flexGrow={1} color="rgb(69, 69, 69)" fontWeight="fontWeightMedium">
              {change?.ownerName}
              <Box component="span" ml={0.6} color="rgb(164, 177, 189)">
                {`| ${change?.description} |`}
                {change?.formattedTime}
              </Box>
            </Box>
          </Box>
        )}
      </FBMapWrapper>
    )}
  </>
);

export default withFBApprovalAudit(FBApprovalAudit);
