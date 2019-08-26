import React from "react";
import { Redirect } from "react-router-dom";
import { DocumentRevision, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { canCreateNewVersion } from "./helpers";
import { documentVersionPath } from "../document.revision/utils/paths";
import DocumentRevisionCreateContainer from "./DocumentRevisionCreate.container";
import { ApplicationState } from "../../state/reducers";
import { connect } from "react-redux";

export interface OwnProps {
  documentRevision: DocumentRevision;
}

interface StateProps {
  hasDraftVersion: boolean;
}

type CloneContainerProps = OwnProps & StateProps;

const getHasDraftVersion = documentRevisionsSelectors.makeGetHasDraftVersion();
const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  hasDraftVersion: getHasDraftVersion(state, props.documentRevision.document.id),
});
export const CloneContainer: React.FunctionComponent<CloneContainerProps> = ({
  documentRevision, hasDraftVersion
}) => {
  if (!canCreateNewVersion(documentRevision, hasDraftVersion, true)) {
    return <Redirect to={documentVersionPath(documentRevision.id, documentRevision.document.id)} />;
  }
  return (
    <DocumentRevisionCreateContainer documentRevision={documentRevision} />
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(CloneContainer);
