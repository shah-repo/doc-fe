import React from "react";
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
    return (
        <div>
            <UserProfilePresenter
                isOpen={showUserProfile}
                close={closeUserProfile}
                canEditGroups={false}
            />
        </div>
    );
};

export default UserProfileContainer;
