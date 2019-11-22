import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { documentTypeActions } from "../../state/ducks/documentRevisions/documentType";

const DataFetcherContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(documentTypeActions.loadList());
  }, []);

  // NOTE: should we show error messages here?
  return null;
};

export default DataFetcherContainer;
