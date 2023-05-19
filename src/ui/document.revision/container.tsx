import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import {
  documentRevisionsActions,
  documentRevisionsSelectors,
} from '../../state/ducks/documentRevisions';
import { ApplicationState } from '../../state/reducers';
import Switch from '../app/Switch';
import {
  DOCUMENT_REVISION_DETAILS_URL,
  DOCUMENT_REVISION_NEW_VERSION_URL,
  DOCUMENT_REVISION_OUTPUT_URL,
  DOCUMENT_REVISION_VERSION_URL,
} from '../constants/urls';
import DocumentRevisionManagerContainer from '../documentRevision/DocumentRevisionsManager.container';
import {
  ContainerDispatchProps,
  ContainerOwnProps,
  ContainerProps,
  ContainerStateProps,
} from './utils/types';

type DispatchProps = ContainerDispatchProps;
type StateProps = ContainerStateProps;
type OwnProps = ContainerOwnProps;
export type Props = ContainerProps;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAsyncState: documentRevisionsSelectors.getLoadAsyncState(state),
  dataProp: documentRevisionsSelectors.getDocumentRevision(state, props.match.params.documentRevisionId),
});

export const Container: React.FunctionComponent<Props> = ({
  match,
  location,
}) => {
  const documentId = match.params.documentId;
  const deprecatedAt = queryString.parse(location.search).deprecated_at as string;

  const renderWrapper = (props: any) => {
    const documentRevisionId = props.match.params.documentRevisionId;
    const isNewVersion = props.match.path === DOCUMENT_REVISION_NEW_VERSION_URL;
    const isNewOutput = props.match.path === DOCUMENT_REVISION_OUTPUT_URL;

    return (
      <DocumentRevisionManagerContainer
        documentRevisionId={documentRevisionId}
        documentId={documentId}
        isNewVersion={isNewVersion}
        isNewOutput={isNewOutput}
        deprecatedAt={deprecatedAt}
      />
    );
  };

  const renderDocumentRevisionManagerContainer = (props: any) => renderWrapper(props);

  return (
    <Switch>
      <Route path={DOCUMENT_REVISION_VERSION_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
      <Route path={DOCUMENT_REVISION_DETAILS_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
      <Route path={DOCUMENT_REVISION_NEW_VERSION_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
      <Route path={DOCUMENT_REVISION_OUTPUT_URL} exact={true} render={renderDocumentRevisionManagerContainer} />
    </Switch>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  load: documentRevisionsActions.load,
})(Container);
