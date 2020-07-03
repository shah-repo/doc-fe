import React from "react";
import { useSelector } from "react-redux";
import { DocumentType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { DOCUMENT_BY_TYPE_ROOT_URL } from "../../constants/urls";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}
const DocumentByTypeListLinks: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const docTypesWithPageDetails: DocumentType[] = useSelector(
    documentTypeSelectors.getDocumentTypesWithPageDetails,
  );

  if (docTypesWithPageDetails.length === 0) {
    return null;
  }

  return (
    <>
      {docTypesWithPageDetails.map((docType: DocumentType) => (
        <NavigationLinkContainer
          key={docType.id}
          path={`${DOCUMENT_BY_TYPE_ROOT_URL}/${docType.id}`}
          label={docType.documentTypeName}
          currentPath={pathname}
          type="LINK"
        />
      ))}
    </>
  );
};

export default DocumentByTypeListLinks;
