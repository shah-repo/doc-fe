import React, { useEffect } from "react";
import { Company, companyActions } from "../../state/ducks/company";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";

const company: Company = {
  id: "279382d6-c7a1-46af-903d-e3ae77e268d8",
  name: "Company #6",
  maxRevisionStages: 3,
  users: [],
  documentTypes: [],
  whiteLabeling: {
    logo: "https://cdn.worldvectorlogo.com/logos/puma-logo.svg",
    colors: {
      primary: "#49A846",
      primaryContrastText: "",
      secondary: "#CE138A",
      secondaryContrastText: "#FFFFFF",
      defaultBackground: "#FFAB00",
    },
  },
};

const DataFetcherContainer: React.FunctionComponent = () => {
  const selectCompanyAction = useActionCreator(companyActions.selectCompany);
  const selectCompanyAsync = useAsync();
  const loadDocumentTypesAction = useActionCreator(documentTypeActions.loadList);
  const loadDocumentTypesAsync = useAsync();

  useEffect(() => {
    selectCompanyAsync.start(selectCompanyAction, company);
    loadDocumentTypesAsync.start(loadDocumentTypesAction, loadDocumentTypesAsync);
  }, []);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;
