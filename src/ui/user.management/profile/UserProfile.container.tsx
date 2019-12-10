import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { Group, GroupTag, UserMeEditRequestBody } from "../../../state/ducks/auth/types";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import UserProfilePresenter from "./UserProfile.presenter";

interface OwnProps {
    closeUserProfile: () => void;
    showUserProfile: boolean;
}

interface DispatchProps {
  editUserMe: typeof authActions.editUserMe;
}

export type Props = OwnProps & DispatchProps;

export const UserProfileContainer: React.FunctionComponent<Props> = ({
    closeUserProfile,
    showUserProfile,
    editUserMe,
}) => {
    const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));
    const name = useSelector(authSelectors.currentUserName);
    const avatar = useSelector(authSelectors.currentEmployeeAvatar);

    const [groupMe, setGroupMe] = useState<OptionType[]>([]);
    const loadGroupsMeAction = useActionCreator(userManagementActions.loadGroupsMe);

    const asyncGroup = useAsync<Group[]>({
      onSuccess: (data = []) => {
        const options: OptionType[] = data.map((group) => ({
          value: group.id,
          label: group.name,
        }));
        setGroupMe(options);
      },
    });
    const async = useAsync();

    const loadGroupsMe = () => asyncGroup.start(loadGroupsMeAction, asyncGroup);
    const onSubmit = (values: UserMeEditRequestBody) => {
      async.start(
          editUserMe,
          values,
        async,
      );
    };
    useEffect(() => {
        loadGroupsMe();
    }, []);

    return (
            <UserProfilePresenter
                isOpen={showUserProfile}
                close={closeUserProfile}
                canManageUsers={canManageUsers}
                employeeGroups={groupMe}
                name={name}
                avatar={avatar}
                editUserMe={onSubmit}
            />
    );
};

export default connect<{}, DispatchProps, OwnProps, {}>(null, {
  editUserMe: authActions.editUserMe,
})(UserProfileContainer);
