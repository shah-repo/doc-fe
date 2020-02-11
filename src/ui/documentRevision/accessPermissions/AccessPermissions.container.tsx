import React from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../../state/ducks/auth";
import { changeRequestsActions, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { userManagementSelectors } from "../../../state/ducks/userManagement";
import { ApplicationState } from "../../../state/reducers";
import useActionCreator from "../../hooks/useActionCreator";
import AccessPermissionsPresenter from "./AccessPermissions.presenter";

interface OwnProps {
  canAccess: boolean;
  withoutCurrentUser: boolean;
}

export type AccessPermissionsContainerProps = OwnProps;

export const AccessPermissionsContainer: React.FunctionComponent<AccessPermissionsContainerProps> = ({
  canAccess,
  withoutCurrentUser = false,
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

    return (
        <AccessPermissionsPresenter
            canAccess={canAccess}
            loadAvailableApproversAction={loadAvailableApproversAction}
            availableApprovers={availableApprovers}
            loadApproversAsyncState={loadApproversAsyncState}
            groupOptions={groupOptions}
        />
 );
};

export default AccessPermissionsContainer;
