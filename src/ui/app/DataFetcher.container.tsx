import React from "react";
import { connect } from "react-redux";
import { documentTypeActions, documentTypeSelectors } from "../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";

interface DispatchProps {
  loadDocumentTypes: typeof documentTypeActions.loadList;
}

interface StateProps {
  loadDocTypeAsyncState: AsyncState;
}

type DataFetcherContainerProps = DispatchProps & StateProps;

const mapStateToProps = (state: ApplicationState) => ({
  loadDocTypeAsyncState: documentTypeSelectors.getLoadListAsyncState(state),
});

const DataFetcherContainer: React.FunctionComponent<DataFetcherContainerProps> = ({
  loadDocumentTypes,
  loadDocTypeAsyncState,
}) => {
  const loadAction = () => loadDocumentTypes();

  return (
    <AsyncGate asyncState={loadDocTypeAsyncState} asyncAction={loadAction} startActionOnMount={true} />
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, {
  loadDocumentTypes: documentTypeActions.loadList,
})(DataFetcherContainer);
