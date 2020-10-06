import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import { FBApprovalAudit, FBAutocomplete, FBButton, FBDialog, FBFieldName, FBInlineApprovalBody, FBInlineApprovalProps, FBInlineApprovalSocket, FBInlineApprovalStatusIdent, FBInput, FBMapWrapper, FBProvider, FBText } from "..";
import Colors from "../../layout/theme/utils/colors";
import { withFBInlineApproval } from "./FBInlineApproval.wrap";

const FBInlineApproval: React.FunctionComponent<FBInlineApprovalProps> = ({
  onApproveClick,
  approvalTransition,
  dialogState,
  inlineApprovalState,
  label = "form.builder.approvers",
  approvals = [],
  currentUser,
  isApproved,
  isPreview,
  index,
  type,
  disabled,
  options,
  loading,
  name,
  ...props
}) => (
  <FBProvider {...{ dialogState, [`${FBFieldName.ApprovalState}-${name}`]: inlineApprovalState }}>
    <FBDialog />
    <FBInlineApprovalSocket {...{ name }} />
    <FBInput {...props} {...{ name }} type="inlineapproval">
      <Box
        py={1}
        mb={4}
        mt={1}
        display="flex"
        border={1}
        borderLeft={0}
        borderRight={0}
        borderTop={0}
        borderColor={isApproved ? Colors.light_green : Colors.medium_red}
      >
        {isApproved && <CheckCircleIcon style={{ color: Colors.light_green }} />}
        {!isApproved && <ErrorIcon style={{ color: Colors.medium_red }} />}
        <Box ml={1} width="100%" display="flex" mt={0.3}>
          {isApproved && <FBText locale="form.builder.approved" />}
          {!isApproved && (
            <>
              <FBText boxProps={{ flexGrow: 1 }} locale="form.builder.approval.pending" />
              <FBText boxProps={{ fontSize: "caption.fontSize", mt: 0.2 }} locale="form.builder.approval.instruction" />
            </>
          )}
        </Box>
      </Box>
      {options && !isPreview && (
        <FBAutocomplete
          {...{ label, disabled, options, loading }}
          name={`fb-ia-${name}`}
          multiple
          withState
          optionLabelKey="user.email"
          labelPrefixRoot="user.name"
          optionValueKey="id"
          groupByKey="listGroup"
          gutter={false}
        />
      )}
      <Box my={1}>
        <FBApprovalAudit {...{ name, type, index }} />
      </Box>
      <Box mt={approvals.length ? 1 : 0}>
        <FBMapWrapper<FBInlineApprovalBody[]> collection={approvals}>
          {(approval: FBInlineApprovalBody, index) => (
            <Box
              key={`fb-ia-info-${approval.id}-${index}`}
              pb={currentUser === approval.approver?.user.id ? 0 : 0.6}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              {approval.approver?.user.name}
              {approval.status && approval.status !== "DRAFT" && (
                <Box color={Colors.gray}> | {FBInlineApprovalStatusIdent[approval.status]}</Box>
              )}
              {approval.canRequest && (
                <>
                  <Box pl={0.5}>|</Box>
                  <FBButton
                    style={{ margin: 0 }}
                    label="form.builder.request.approval"
                    variant="text"
                    color="primary"
                    onClick={() => approvalTransition?.("pending", approval.id)}
                  />
                </>
              )}
              {currentUser === approval.approver?.user.id
              && (
                <Box flexGrow={1} textAlign="right">
                  <FBButton
                    disabled={disabled || approval.status === "APPROVED"}
                    label="form.builder.request.approve"
                    size="small"
                    style={{ fontSize: "11px" }}
                    onClick={() => onApproveClick?.(approval.id || "")}
                  />
                </Box>
              )}
            </Box>
          )}
        </FBMapWrapper>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBInlineApproval(FBInlineApproval);
