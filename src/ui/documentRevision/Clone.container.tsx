import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { DocumentRevision, documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { documentVersionPath } from "../document.revision/utils/paths";
import DocumentRevisionCreateContainer from "./DocumentRevisionCreate.container";
import { canCreateNewVersion, canCreateOutput } from "./helpers/documentRevisionPermissions";

export type DocumentCloneType = "none" | "newVersion" | "newOutput";

interface OwnProps {
  documentRevision: DocumentRevision;
  type: DocumentCloneType;
  isNewVersion: boolean;
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
  documentRevision,
  disableCreateNewVersion,
  type,
  isNewVersion,
}) => {
  const redirect = (
    ((type === "newVersion") && !canCreateNewVersion(documentRevision, disableCreateNewVersion, true)) ||
    ((type === "newOutput") && !canCreateOutput(documentRevision))
  );

  if (redirect) {
    return <Redirect to={documentVersionPath(documentRevision.id, documentRevision.document.id)} />;
  }

  return (
    <DocumentRevisionCreateContainer documentRevision={documentRevision} type={type} isNewVersion={isNewVersion} />
  );
};

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps)(CloneContainer);
