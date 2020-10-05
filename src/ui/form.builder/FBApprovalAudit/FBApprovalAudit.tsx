import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBApprovalAuditProps, FBAuditData, FBMapWrapper } from "..";
import Colors from "../../layout/theme/utils/colors";
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
          <Box
            mb={1}
            key={`fb-approval-audit-${change.id}-${index}`}
            display="flex"
            alignItems="center"
          >
            <Box flexGrow={1}>
              {change?.ownerName}
              <Box component="span" ml={0.6} color={Colors.gray}>
                | {change.description} |
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
