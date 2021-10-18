import { Box, Button, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { approvalsActions } from "../../../state/ducks/approvals";
import { Approval } from "../../../state/ducks/common/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { toastError } from "../../components/notifications";
import Text from "../../components/Text";
import { documentVersionPath } from "../../document.revision/utils/paths";
import { FBInlineApprovalTransition } from "../../form.builder";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { DocumentRevisionApprovalDialog } from "./DocumentRevisionApprovalDialog";
import { styles } from "./PendingAction.styles";

interface Props {
  index: number;
  documentRevision: DocumentRevision;
  approval: Approval;
}

const DocumentRevisionApproval: React.FunctionComponent<Props> = ({
  index,
  documentRevision,
  approval,
}) => {
  const classes = styles();
  const intl = useIntl();
  const [docTitle] = useState(intl.formatMessage(
    { id: "dashboard.title.approval.request" },
    { docId: documentRevision.document.docId, name: documentRevision.owner.user.name },
  ));
  const passwordDialog = useDialog();

  const applyTransition = useActionCreator(approvalsActions.applyTransition);
  const async = useAsync({
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      toastError(error as string);
    },
  });

  const changeApprovalStatus = (transition: FBInlineApprovalTransition, approvalId?: string, password?: string) => {
    async.start(
      applyTransition,
      approvalId,
      transition,
      async,
      password,
    );
  };

  const linkRenderer = () => (
    <Link
      to={documentVersionPath(documentRevision.id, documentRevision.document?.id || "")}
      className={classes.actionLink}
    >
      <Box>
        <Box
          color="primary.main"
          fontWeight="fontWeightBold"
          marginBottom="5px"
        >
          {docTitle}
        </Box>
        <Box>
          {documentRevision.name}
        </Box>
      </Box>
    </Link>
  );

  return (
    <>
      <Grid container className={classes.containerWrap}>
        <Grid item xs={9}>
          {linkRenderer()}
        </Grid>
        <Grid item xs={3} className={classes.itemWrap}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => changeApprovalStatus("reject", approval.id)}
          >
            <Text translation="transition.action.reject"/>
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => passwordDialog.open()}
          >
            <Text translation="transition.action.approve"/>
          </Button>
        </Grid>
      </Grid>
      <DocumentRevisionApprovalDialog
        asyncState={async.asyncState}
        approvalId={approval.id}
        {...{ changeApprovalStatus, passwordDialog }}
      />
    </>
  );
};

export default DocumentRevisionApproval;
