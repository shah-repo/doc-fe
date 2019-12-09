import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getHasTag } from "../../../common/utils/selectors";
import { Group, GroupTag } from "../../../state/ducks/auth/types";
import { userManagementActions } from "../../../state/ducks/userManagement";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import UserProfilePresenter from "./UserProfile.presenter";

interface OwnProps {
    closeUserProfile: () => void;
    showUserProfile: boolean;
}

export type Props = OwnProps;
export const UserProfileContainer: React.FunctionComponent<Props> = ({
    closeUserProfile,
    showUserProfile,
}) => {
    const canManageUsers = useSelector(getHasTag(GroupTag.USER_MANAGEMENT));

    const [groupMe, setGroupMe] = useState<OptionType[]>([]);
    const loadGroupsMeAction = useActionCreator(userManagementActions.loadGroupsMe);

    const async = useAsync<Group[]>({
      onSuccess: (data = []) => {
        const options: OptionType[] = data.map((group) => ({
          value: group.id,
          label: group.name,
        }));
        setGroupMe(options);
      },
    });

    const loadGroupsMe = () => async.start(loadGroupsMeAction, async);

    useEffect(() => {
        loadGroupsMe();
    }, []);

    return (
            <UserProfilePresenter
                isOpen={showUserProfile}
                close={closeUserProfile}
                canManageUsers={canManageUsers}
                employeeGroups={groupMe}
                employee={{user: {name: "maja", id: "123id", email: "email"}}}
            />
    );
};

export default UserProfileContainer;
