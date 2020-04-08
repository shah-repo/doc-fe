import { Box } from "@material-ui/core";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { Provider } from "mobx-react";
import React from "react";
import { FBInlineApprovalProps } from ".";
import { FBApprovalField } from "..";
import Text from "../../components/Text";
import FBConditionalWrapper from "../FBConditionalWrapper";
import FBDRStore from "../stores/ui/FBDRStore";
import { withFBInlineApproval } from "./FBInlineApproval.wrap";

const FBInlineApproval: React.FunctionComponent<FBInlineApprovalProps> = ({
  inlineApprovalState,
  onClick,
  onMouseOver,
  onMouseLeave,
  toolsVisible,
  editApproval,
  removeApproval,
  label,
  mode,
  approveIsBlocking,
  approverGroups,
  approvers,
  name,
}) => (
  <Provider {...{ inlineApprovalState }}>
    <FBConditionalWrapper
      condition={FBDRStore.isOutput}
      wrapper={(children) => (
        <Box>
          <Box display="flex" flexDirection="row-reverse">
            <Box mx={2}><RemoveCircleOutlineIcon color="error" onClick={removeApproval} /></Box>
            <BorderColorIcon color="primary" onClick={editApproval} />
          </Box>
          {children}
        </Box>
      )}
    >
      <Box mb={3} mt={FBDRStore.isOutput ? 0 : 3}>
        {(mode === "placeholder" || mode === "starter") && (
          <Box
            style={{ borderStyle: "dashed" }}
            borderColor="gray"
            p={1.5}
            fontSize="h6.fontSize"
            fontWeight={300}
            border={1}
          >
            {label || <Text message="form.builder.inlineapproval" />}
          </Box>
        )}
        {mode === "defined" && (
          <FBApprovalField
            {...{ approvers, approverGroups, approveIsBlocking, label: "form.builder.approval" }}
            name={`fb-approval-field-${name}`}
          />
        )}
      </Box>
    </FBConditionalWrapper>
  </Provider>
);

export default withFBInlineApproval(FBInlineApproval);
