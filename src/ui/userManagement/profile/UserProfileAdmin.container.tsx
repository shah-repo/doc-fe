import React, { useState } from "react";
import UserProfilePresenter from "./UserProfile.presenter";

export const UserProfileAdminContainer: React.FunctionComponent = () => {

    const [showUserProfile, setUserProfile] = useState(false);

/*     const openUserProfile = () => {
        setUserProfile(true);
    }; */

    const closeUserProfile = () => setUserProfile(false);

    return (
        <div>
        <UserProfilePresenter
            isOpen={showUserProfile}
            close={closeUserProfile}
        />

        </div>
    );
};

export default UserProfileAdminContainer;
