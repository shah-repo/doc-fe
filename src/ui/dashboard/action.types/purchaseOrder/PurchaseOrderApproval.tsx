import React, { useState } from "react";
import { useIntl } from "react-intl";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { documentPreviewPath } from "../../../document.revision/utils/paths";
import DashboardActionTypeBase from "../DashboardActionTypeBase";
import PODetailsContainer from "./PODetailsContainer";

interface Props {
  key: number;
  documentRevision: DocumentRevision;
}

export const PurchaseOrderApproval: React.FunctionComponent<Props> = ({
  key,
  documentRevision,
}) => {
  const intl = useIntl();
  const [title] = useState(intl.formatMessage(
    { id: "dashboard.title.purchase.order" },
    { docId: documentRevision.document.docId, version: documentRevision.version },
  ));
  const [description] = useState(intl.formatMessage({ id: "dashboard.assigned.purchase.order" }));

  return (
    <DashboardActionTypeBase
      key={key}
      title={title}
      description={description}
      url={documentPreviewPath(documentRevision.id, documentRevision.document.id)}
    >
      <PODetailsContainer documentRevision={documentRevision} />
    </DashboardActionTypeBase>
  );
};

export default PurchaseOrderApproval;
