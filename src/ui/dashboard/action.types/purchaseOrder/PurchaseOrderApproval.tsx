import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Attachment } from "../../../../state/ducks/attachments/types";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import { documentPreviewPath } from "../../../document.revision/utils/paths";
import { generateRevisionNumber } from "../../../documentRevision/helpers/generateRevisionNumber";
import DashboardActionTypeBase from "../DashboardActionTypeBase";
import PODetailsContainer from "./PODetailsContainer";

interface Props {
  index: number;
  documentRevision: DocumentRevision;
  docRevAttachments: Attachment[];
}

const PurchaseOrderApproval: React.FunctionComponent<Props> = ({
  index,
  documentRevision,
  docRevAttachments,
}) => {
  const intl = useIntl();
  const [version] = useState(generateRevisionNumber(
    documentRevision.revision,
    documentRevision.revisionStage,
    documentRevision.subRevision,
    documentRevision.revisionChangeType,
  ));
  const [title] = useState(intl.formatMessage(
    { id: "dashboard.title.purchase.order" },
    { docId: documentRevision.document.docId, version },
  ));
  const [description] = useState(intl.formatMessage(
    { id: "dashboard.assigned.purchase.order" },
    { name: documentRevision.owner.user.name },
  ));

  return (
    <DashboardActionTypeBase
      index={index}
      title={title}
      description={description}
      url={documentPreviewPath(documentRevision.id, documentRevision.document.id)}
      dataCy="pendingActionsPO"
    >
      <PODetailsContainer {...{ documentRevision, docRevAttachments }} />
    </DashboardActionTypeBase>
  );
};

export default PurchaseOrderApproval;
