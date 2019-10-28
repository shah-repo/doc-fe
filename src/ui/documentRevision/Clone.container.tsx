import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { DocumentRevision, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import DocumentRevisionCreateContainer from "./DocumentRevisionCreate.container";
import { canCreateNewVersion } from "./helpers";

export interface OwnProps {
  documentRevision: DocumentRevision;
}

interface StateProps {
  disableCreateNewVersion: boolean;
}

export type CloneContainerProps = OwnProps & StateProps;

const getDisableCreateNewVersion = documentRevisionsSelectors.makeGetDisableCreateNewVersion();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  disableCreateNewVersion: getDisableCreateNewVersion(state, props.documentRevision.document.id),
});
export const CloneContainer: React.FunctionComponent<CloneContainerProps> = ({
  documentRevision, disableCreateNewVersion,
}) => {
  if (!canCreateNewVersion(documentRevision, disableCreateNewVersion, true)) {
    return <Redirect to={documentVersionPath(documentRevision.id, documentRevision.document.id)} />;
  }
  return (
    <DocumentRevisionCreateContainer documentRevision={documentRevision} />
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(CloneContainer);
