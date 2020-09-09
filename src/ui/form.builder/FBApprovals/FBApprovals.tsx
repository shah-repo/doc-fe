import { Box } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBInlineApprovalBody, FBInlineApprovalStatusIdent, FBInput, FBMapWrapper, FBRequiredApprover, FBSection, FBText } from "..";
import { ApprovalStatus } from "../../../state/ducks/common";
import { DocumentStatus } from "../../../state/ducks/documents";
import Colors from "../../layout/theme/utils/colors";
import { FBApprovalsProps } from "./FBApprovals.types";
import { withFBApprovals } from "./FBApprovals.wrap";

const FBApprovals: React.FunctionComponent<FBApprovalsProps> = ({
  requestApproval,
  approvals = [],
  changeApprovalStatus,
  currentUser,
  disabled,
  docId,
  documentStatus,
  groups = {},
  isIncluded,
  label,
  name,
  ownerId,
  renderOption,
  loading,
  ...props
}) =>
  // const classes = styles();
  (
    <FBInput {...props} {...{ name }} type="approvals">
      <FBSection {...{ label }} />
      <FBAutocompleteAsync
        label="form.builder.approvals"
        name={`fb-approvals-${name}`}
        optionId={FBAutocompleteAsyncOption.availableApprovers}
        withState
        gutter={false}
        multiple={true}
        {...{ disabled, renderOption }}
      />
      <Box display="flex" flexWrap="wrap" my={2}>
        <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
          {(group: FBRequiredApprover, id) => (
            <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5}>
              <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
              <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
            </Box>
          )}
        </FBMapWrapper>
      </Box>
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
                <Box> |</Box>
                <FBButton
                  style={{ margin: 0 }}
                  label="form.builder.request.approval"
                  variant="text"
                  color="primary"
                  onClick={() => requestApproval?.(approval.id)}
                />
              </>
            )}
            {documentStatus === DocumentStatus.InReview
            && approval.status === ApprovalStatus.Pending
            && currentUser === approval.approver?.user.id
            && (
              <Box flexGrow={1} textAlign="right">
                <FBButton
                  {...{ disabled }}
                  label="common.reject"
                  size="small"
                  style={{ fontSize: "11px" }}
                  onClick={() => changeApprovalStatus("reject", approval.id)}
                />
                <FBButton
                  {...{ disabled }}
                  label="form.builder.request.approve"
                  size="small"
                  style={{ fontSize: "11px" }}
                  onClick={() => changeApprovalStatus("approve", approval.id)}
                />
              </Box>
            )}
          </Box>
        )}
      </FBMapWrapper>
    </FBInput>
    // <FBProvider>
    //   {(documentStatus === DocumentStatus.Draft || documentStatus === DocumentStatus.InReview) && (
    //     <>
    //       <FBSection {...{ label }} />
  // <FBAutocompleteAsync
  //   label="form.builder.approvals"
  //   optionId={FBAutocompleteAsyncOption.availableApprovers}
  //   optionValueType="id"
  //   withState={true}
  //   {...{ renderOption, disabled, name }}
  // />
    //       {docId && (
    //         <Box mt={2}>
  // <Typography variant="h6">
  //   <Text translation="record.required.approvals" />
  // </Typography>
    //           <Box display="flex" flexWrap="wrap" mt={1}>
  // <FBMapWrapper<Record<string, FBRequiredApprover>> collection={groups}>
  //   {(group: FBRequiredApprover, id) => (
  //     <Box display="flex" key={`fb-approvers-group-${id}`} mr={2.5}>
  //       <CheckCircleIcon color={isIncluded?.(group) ? "primary" : "disabled"} />
  //       <FBText boxProps={{ mt: 0.2, pl: 0.5 }} locale={group.name} />
  //     </Box>
  //   )}
  // </FBMapWrapper>
    //           </Box>
    //         </Box>
    //       )}
    //     </>
    //   )}
    //   {docId && approvals.length > 0 && (
    //     <Box mt={2}>
    //       <Typography variant="h6">
    //         <Text translation="form.builder.approvals" />
    //       </Typography>
    //       <Box mt={2}>
  // <FBMapWrapper<Approval[]> collection={approvals}>
  //   {(approval: Approval) => (
  //     <>
  //       <Box p={2} mt={-2}>
  //         <Box display="flex" alignItems="center">
  //           <Typography id="userName" variant="h5" component="span">{approval.approver.user.name}</Typography>
  //           <Typography id="statusdate" variant="h5" component="span">
  //             {` | ${approval.status}`}
  //             {approval.reviewedAt && (
  //               <span>
  //                 {" | "}
  //                 <DateTime value={approval.reviewedAt} />
  //               </span>
  //             )}
  //           </Typography>
  //           {ownerId === currentEmployeeId
  //       && (approval.status === ApprovalStatus.Pending || approval.status === ApprovalStatus.Draft)
  //       && (
  //         <Typography
  //           className={classes.removeButton}
  //           variant="h6"
  //           onClick={() => changeApprovalStatus(FBApprovalsStatusEndpoint.ABANDON, approval.id)}
  //         >
  //           {" | "}
  //           <Text translation="record.remove.approval" />
  //         </Typography>
  //       )}
  //         </Box>
  //       </Box>
  //       <Box>
  //         {documentStatus === DocumentStatus.InReview
  //       && approval.status === ApprovalStatus.Pending
  //       && approval.approver.id === currentEmployeeId
  //       && changeApprovalStatus && (
  //           <Box display="flex" justifyContent="flex-end">
  //             <Button
  //               variant="contained"
  //               onClick={() => changeApprovalStatus(FBApprovalsStatusEndpoint.APPROVE, approval.id)}
  //             >
  //               <Text translation="common.approve" />
  //             </Button>
  //             <Button onClick={() => changeApprovalStatus(FBApprovalsStatusEndpoint.REJECT, approval.id)}>
  //               <Text translation="common.reject" />
  //             </Button>
  //           </Box>
  //         )}
  //       </Box>
  //     </>
  //   )}
  // </FBMapWrapper>
    //       </Box>
    //     </Box>
    //   )}
    // </FBProvider>
  );

export default withFBApprovals(FBApprovals);
