import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBMapWrapper, FBProvider, FBRequiredApprover, FBSection, FBText } from "..";
import { DocumentStatus } from "../../../state/ducks/documents";
import { FBApprovalsProps } from "./FBApprovals.types";
import { withFBApprovals } from "./FBApprovals.wrap";

const FBApprovals: React.FunctionComponent<FBApprovalsProps> = ({
  approvals = [],
  approvalsState,
  formState,
  isIncluded,
  groups = {},
  label,
  documentStatus,
  name,
  docId,
}) => (
  <FBProvider {...{ approvalsState, formState }}>
    {docId && (documentStatus === DocumentStatus.Draft || documentStatus === DocumentStatus.InReview) && (
      <>
        <FBSection {...{ label }} />
        <FBAutocompleteAsync
          label="form.builder.approvals"
          optionId={FBAutocompleteAsyncOption.availableApprovers}
          optionValueType="id"
          name={name}
          withState={true}
        />
        <Box display="flex" flexWrap="wrap">
          <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
            {(group: FBRequiredApprover, id) => (
              <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5} >
                <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
                <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
              </Box>
            )}
          </FBMapWrapper>
        </Box>
      </>
    )}
  </FBProvider>
);

export default withFBApprovals(FBApprovals);
