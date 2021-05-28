import { Box } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../../state/ducks/auth";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import { ApplicationState } from "../../../../state/reducers";
import GenerateHtmlPreview from "../../../documentRevision/forms/presenters/GenerateHtmlPreview";
import POApproveOrReject from "./POApproveOrReject";

interface Props {
  documentRevision: DocumentRevision;
}

const POActions: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const currentEmployeeId = useSelector((state: ApplicationState) => authSelectors.currentEmployeeId(state));
  const approvalId = (documentRevision?.approvals || []).find((x) => x.approver.id === currentEmployeeId)?.id;

  return (
    <Box display="flex">
      <GenerateHtmlPreview
        id={documentRevision.id}
        renderHTML={documentRevision.formDocument?.renderHTML}
        showDownloadButton={true}
      />
      {
        documentRevision?.approvals && approvalId &&
        <POApproveOrReject approvalId={approvalId} />
      }
    </Box>
  );
};

export default POActions;
