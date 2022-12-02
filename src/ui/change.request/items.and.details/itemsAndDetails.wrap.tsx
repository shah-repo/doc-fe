/* eslint-disable no-console */
import React, { useState } from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DOC_TYPE_GROUP } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import ItemsAndDetails from "./ItemsAndDetails";
import { ChangeOrderGridItem, FBDocumentRevisionsValue } from "./ItemsAndDetails.types";

const ItemsAndDetailsWrapper: React.FunctionComponent<{
  changeRequest: ChangeRequest;
}> = ({
  changeRequest,
}) => {

  const [entries, setEntries] = useState<ChangeOrderGridItem[]>([]);

  React.useEffect(() => {
    processChangeRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeRequest]);

  const processChangeRequest = () => {
    const documentRevisionsData = changeRequest.documentRevisions;

    const documentRevisiosnAssigned = changeRequest.formInput?.documentRevisions ?? [];
    const entries = documentRevisiosnAssigned.map((item: FBDocumentRevisionsValue) => {
      const entryInfo = {
        justificationOfChange: item.justificationOfChange,
        descriptionOfChange: item.descriptionOfChange,
        docRevId: item.proposedDocumentRevision.id,
        documentId: "",
        id: item.id,
        titleText: "",
        displayRevision: "",
        isPart: false,
      };

      const docRevId = item.proposedDocumentRevision.id;
      const { displayRevision, name, document } =
        documentRevisionsData.find((docRev: DocumentRevision) => docRev.id === docRevId);
      if (document) {
        entryInfo.titleText = generateDocTitleText(document.docId, displayRevision, name);
        entryInfo.isPart = document.documentType.group === DOC_TYPE_GROUP.PART;
        entryInfo.documentId = document.id;
        entryInfo.displayRevision = displayRevision;
      }

      return entryInfo;
    });

    setEntries(entries);
  };

  const generateDocTitleText = (docId: string, displayRevision: string, name: string) => (
    `${docId} # rev ${displayRevision} - ${name}`
  );

  return (
    <ItemsAndDetails
      entries = {entries}
      generateDocTitleText = {generateDocTitleText}
    />
  );

};


export default ItemsAndDetailsWrapper;
