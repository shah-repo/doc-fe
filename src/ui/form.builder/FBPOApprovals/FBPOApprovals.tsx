import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBInput, FBMapWrapper, FBRequiredApprover, FBSection, FBText } from "..";
import { FBPOApprovalsProps } from "./FBPOApprovals.types";
import { withFBPOApprovals } from "./FBPOApprovals.wrap";

const FBPOApprovals: React.FunctionComponent<FBPOApprovalsProps> = ({
  renderOption,
  isIncluded,
  name,
  disabled,
  loading,
  groups = {},
  autosave,
  label,
  ...props
}) => (
  <FBInput {...props} {...{ name, autosave }} type="poapprovals">
    <Box>
      <FBSection
        name={`fb-po-approvals-section-${name}`}
        {...{ label }}
      />
      <FBAutocompleteAsync
        label="form.builder.approvers"
        name={`${name}`}
        optionId={FBAutocompleteAsyncOption.availableApprovers}
        withState
        gutter={false}
        multiple={true}
        omitFormValue={true}
        {...{ disabled, renderOption, loading, autosave }}
      />
      <Box display="flex" flexWrap="wrap" my={2}>
        <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
          {(group: FBRequiredApprover, id) => (
            <Box display="flex" key={`fb-po-approvals-group-${id}`} mr={2.5}>
              <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
              <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
            </Box>
          )}
        </FBMapWrapper>
      </Box>
    </Box>
  </FBInput>
);

export default withFBPOApprovals(FBPOApprovals);
