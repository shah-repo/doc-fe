import React, { useState } from "react";
import { useIntl } from "react-intl";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions/types";
import { documentPreviewPath } from "../../../document.revision/utils/paths";
import { generateRevisionNumber } from "../../../documentRevision/helpers/generateRevisionNumber";
import DashboardActionTypeBase from "../DashboardActionTypeBase";
import PODetailsContainer from "./PODetailsContainer";

interface Props {
  index: number;
  documentRevision: DocumentRevision;
}

export let IndexContetxt = React.createContext(-1);

const PurchaseOrderApproval: React.FunctionComponent<Props> = ({
  index,
  documentRevision,
}) => {
  IndexContetxt = React.createContext(index);
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
    >
      <PODetailsContainer documentRevision={documentRevision} />
    </DashboardActionTypeBase>
  );
};

export default PurchaseOrderApproval;
