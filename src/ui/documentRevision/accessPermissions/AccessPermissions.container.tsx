import { get } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import { useAssignOperatorsToDocument } from "../../hooks/docCustomization/useCustomization";
import AccessPermissionsPresenter from "./AccessPermissions.presenter";

interface OwnProps {
  canAccess: boolean;
  withoutCurrentUser: boolean;
  documentRevisionId: string;
  documentId: string;
  documentTypeId: string;
}

type AccessPermissionsContainerProps = OwnProps;

const AccessPermissionsContainer: React.FunctionComponent<AccessPermissionsContainerProps> = ({
  withoutCurrentUser = false,
  documentId,
  documentRevisionId,
  documentTypeId,
}) => {
  const availableApprovers = useSelector((state: ApplicationState) => {
    if (withoutCurrentUser) {
      const currentUserId = authSelectors.currentUserId(state);
      return changeRequestsSelectors.getApproversListWithoutCurrentUser(state, currentUserId);
    }
    return changeRequestsSelectors.getApproversListForAssessmentForm(state);
  });
  const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
  const selectedDocument = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId));
  const securityGroups = get(selectedDocument, "document.securityGroups", []);
  const securityEmployees = get(selectedDocument, "document.securityEmployees", []);
  const operators = get(selectedDocument, "document.operators", []);

  const { isVisible } = useAssignOperatorsToDocument(documentTypeId);

  return (
    <AccessPermissionsPresenter
      {...{
        isVisible,
        availableApprovers,
        groupOptions,
        securityGroups,
        securityEmployees,
        operators,
        documentId,
        documentRevisionId,
      }}
    />
  );
};

export default AccessPermissionsContainer;
