import { sortBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { GroupTag } from "../../../state/ducks/auth/types";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { HOME_URL } from "../../constants/urls";
import useGetHasTag from "../../hooks/useGetHasTag";
import { KendoGrid } from "./KendoPanel";

export const DocumentTypeManagementContainer: React.FunctionComponent = () => {
  const documentTypes = useSelector(documentTypeSelectors.getDocumentTypeList);
  const canManageDocumentType = useGetHasTag(GroupTag.DOCUMENT_TYPE_MANAGEMENT);

  if (!canManageDocumentType) {
    return <Redirect to={HOME_URL} />;
  }

  return (
    <KendoGrid tableData= {sortBy(documentTypes, "documentTypeName")} />
  );
};
