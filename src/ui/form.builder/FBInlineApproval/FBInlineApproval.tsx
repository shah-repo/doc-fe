import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import { FB, FBApprovalAudit, FBAutocomplete, FBButton, FBDialog, FBFieldName, FBInlineApprovalBody, FBInlineApprovalProps, FBInlineApprovalSocket, FBInlineApprovalStatusIdent, FBInput, FBMapWrapper, FBProvider, FBText } from "..";
import { isDocumentRevisionApproved } from "../../documentRevision/helpers/documentRevisionStatus";
import Colors from "../../layout/theme/utils/colors";
import { FBFontStyle } from "../styles/FBFont.styles";
import { withFBInlineApproval } from "./FBInlineApproval.wrap";
import FBInlinePendingApprovalSocket from "./FBInlinePendingApproval.socket";

const FBInlineApprovalChild: React.FunctionComponent<FBInlineApprovalProps> = ({
  onApproveClick,
  requestAllApprovals,
  label = "form.builder.approvers",
  approvals = [],
  currentUser,
  isApproved,
  isPreview,
  index,
  type,
  options,
  loading,
  name,
  shouldShowApprovals,
  shouldShowRequestAllApprovals,
  disabled,
}) =>
  <>
    <Box
      py={1}
      mb={4}
      mt={1}
      display="flex"
      border={1}
      borderLeft={0}
      borderRight={0}
      borderTop={0}
      borderColor={approvals.length > 0 && isApproved ? Colors.light_green : Colors.latest_red_varient}
    >
      {approvals.length > 0 && isApproved ? 
      (<><CheckCircleIcon style={{ color: Colors.light_green }} /> 
      <FBText locale="form.builder.approved" /></>)
      :
        (<><ErrorIcon style={{ color: Colors.latest_red_varient }} />
        <Box ml={1} width="100%" display="flex" mt={0.3}>
          <FBText boxProps={{
            flexGrow: 1, fontSize: "14px", fontWeight: "600", color: Colors.latest_red_varient, lineHeight: "15px",
          }} locale="form.builder.approval.pending" />
          <FBText boxProps={{
            fontSize: "12px", fontWeight: "400", color: Colors.almost_black, lineHeight: "15px",
          }} locale="form.builder.approval.instruction" />
        </Box></>)
      }
      
    </Box>
    {options && !isPreview && (
      <FBAutocomplete
        {...{ label, disabled, options, loading }}
        name={`fb-ia-${name}`}
        multiple
        withState
        autosave={false}
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
    {shouldShowApprovals && (
      <Box mt={approvals.length ? 1 : 0}>
        <FBMapWrapper<FBInlineApprovalBody[]> collection={approvals}>
          {(approval: FBInlineApprovalBody, index) => {
            const isApproved = isDocumentRevisionApproved(approval.status);
            return (
              <Box mb={4}>
                <Box
                  key={`fb-ia-info-${approval.id}-${index}`}
                  pb={currentUser === approval.approver?.user.id ? 0 : 0.6}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  {<Box fontWeight="bold">{
                    isApproved ? approval.approverName :  approval.approver?.user.name
                  }</Box>}
                  {approval.status && approval.approverGroup && (
                    <Box>&nbsp;| {approval.approverGroup?.join(", ")}</Box>
                  )}
                  {approval.status && (
                    <Box>&nbsp;| {FBInlineApprovalStatusIdent[approval.status]}</Box>
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
                <Box mt={1}>
                  { isApproved ? approval.approverEmail : approval.approver?.user.email }
                </Box>
                {shouldShowRequestAllApprovals &&
                  <Box flexGrow={1} textAlign="right">
                    <FBButton
                      style={{ margin: 0 }}
                      label="form.builder.request.approval"
                      variant="text"
                      color="primary"
                      onClick={() => requestAllApprovals?.(name)}
                    />
                  </Box>
                }
              </Box>
            );
          }}
        </FBMapWrapper>
      </Box>
    )}</>;


const FBInlineApproval: React.FunctionComponent<FBInlineApprovalProps> = ({
  dialogState,
  name,
  inlineApprovalState,
  rules,
  ...props
}) => {
  const  { workspaceState } = FB.useStores();
  const { document } = workspaceState || {};
  const EQname = document?.formInput?.["fb-requipment-maintenance-section"];
  const isPMform = Boolean(document?.["parentEquipment"]?.["formInput"]?.[EQname]?.preventativeForm);

  props.disabled =  props.disabled && !isPMform;
  return (
    <FBProvider {...{ dialogState, [`${FBFieldName.ApprovalState}-${name}`]: inlineApprovalState }}>
      <FBDialog />
      <FBInlinePendingApprovalSocket/>
      <FBInlineApprovalSocket {...{ name }} />
      <FBInput {...props} {...{ name, rules }} type="inlineapproval" labelProps={FBFontStyle.labelProps}>
        <FBInlineApprovalChild {...props} {...{ name }}/>
      </FBInput>
    </FBProvider>
  );
};
export default withFBInlineApproval(FBInlineApproval);
