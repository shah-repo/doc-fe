import _ from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import useActionCreator from "../../hooks/useActionCreator";
import AccessPermissionsPresenter from "./AccessPermissions.presenter";

interface OwnProps {
  canAccess: boolean;
  withoutCurrentUser: boolean;
  documentRevisionId: string;
  documentId: string;
}

export type AccessPermissionsContainerProps = OwnProps;

export const AccessPermissionsContainer: React.FunctionComponent<AccessPermissionsContainerProps> = ({
  withoutCurrentUser = false,
  documentId,
  documentRevisionId,
}) => {
    const loadApproversAsyncState = useSelector(changeRequestsSelectors.getLoadApproversAsyncState);
    const availableApprovers = useSelector((state: ApplicationState) => {
        if (withoutCurrentUser) {
        const currentUserId = authSelectors.currentUserId(state);
        return changeRequestsSelectors.getApproversListWithoutCurrentUser(state, currentUserId);
        }
        return changeRequestsSelectors.getApproversListForAssessmentForm(state);
    });
    const loadAvailableApproversAction = useActionCreator(changeRequestsActions.loadAvailableApprovers);
    const groupOptions = useSelector(userManagementSelectors.getGroupsOptions);
    const selectedDocument = useSelector((state: ApplicationState) => 
    documentRevisionsSelectors.getDocumentRevision(state, documentRevisionId));
    const securityGroups = _.get(selectedDocument, "document.securityGroups", []);
    const securityEmployees = _.get(selectedDocument, "document.securityEmployees", []);

    return (
        <AccessPermissionsPresenter
            loadAvailableApproversAction={loadAvailableApproversAction}
            availableApprovers={availableApprovers}
            loadApproversAsyncState={loadApproversAsyncState}
            groupOptions={groupOptions}
            securityGroups={securityGroups}
            securityEmployees={securityEmployees}
            documentId={documentId}
            documentRevisionId={documentRevisionId}
        />
 );
};

export default AccessPermissionsContainer;
