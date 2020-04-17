import React from "react";
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
}) => (
  <DashboardActionTypeBase
    key={key}
    title="PURCHASE ORDER: PO00771, Rev 2"
    description="Purchase order from XY is pending your approval"
    url={documentPreviewPath(documentRevision.id, documentRevision.document.id)}
  >
    <PODetailsContainer documentRevision={documentRevision} />
  </DashboardActionTypeBase>
);

export default PurchaseOrderApproval;
