import React, { useEffect } from "react";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../hooks/useActionCreator";
import useAsync from "../hooks/useAsync";

const DataFetcherContainer: React.FunctionComponent = () => {
  // const selectCompanyAction = useActionCreator(companyActions.selectCompany);
  // const selectCompanyAsync = useAsync();
  const loadDocumentTypesAction = useActionCreator(documentTypeActions.loadList);
  const loadDocumentTypesAsync = useAsync();

  useEffect(() => {
    // selectCompanyAsync.start(selectCompanyAction, company);
    loadDocumentTypesAsync.start(loadDocumentTypesAction, loadDocumentTypesAsync);
  }, []);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;
