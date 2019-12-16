import React from "react";
import { useSelector } from "react-redux";
import { DocumentType, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { SUPPLIERS_ROOT_URL } from "../../constants/urls";
import { Translation } from "../../translations/types";
import NavigationLinkContainer from "../NavigationLink.container";

interface Props {
  pathname: string;
}
const SuppliersListLink: React.FunctionComponent<Props> = ({
  pathname,
}) => {
  const docTypes = useSelector(documentTypeSelectors.getDocumentTypeList);

  return (
    <>
      {
        docTypes.map((docType: DocumentType) => {
          if (!docType.pageDetails) {
            return null;
          }

          return (
            <NavigationLinkContainer
              key={docType.id}
              url={`${SUPPLIERS_ROOT_URL}/${docType.id}`}
              text={docType.documentTypeName as Translation}
              currentPath={pathname}
            />
          );
        })
      }
    </>
  );
};

export default SuppliersListLink;
