import { Box } from "@material-ui/core";
import { Provider } from "mobx-react";
import React from "react";
import { FBInlineApprovalProps } from ".";
import { FBApprovalField } from "..";
import Text from "../../components/Text";
import FBLabel from "../components/common/FBLabel";
import FBButton from "../components/inputs/FBButton";
import { withFBInlineApproval } from "./FBInlineApproval.wrap";

const FBInlineApproval: React.FunctionComponent<FBInlineApprovalProps> = ({
  inlineApprovalState,
  onClick,
  label,
  mode,
  approveIsBlocking,
  approverGroups,
  approvers,
  name,
  ...props
}) => (
  <Provider {...{ inlineApprovalState }}>
    <Box mb={3}>
      {label && <FBLabel {...{ label }} />}
      {mode === "placeholder" && (
        <Text message="form.builder.inlineapproval" />
      )}
      {mode === "starter" && (
        <FBButton
          label="form.builder.set.approvers"
          {...{ onClick }}
        />
      )}
      {mode === "defined" && (
        <FBApprovalField
          {...{ approvers, approverGroups, approveIsBlocking, label: "form.builder.approval" }}
          name={`fb-approval-field-${name}`}
        />
      )}
    </Box>
  </Provider>
);

export default withFBInlineApproval(FBInlineApproval);
