import { Dialog } from "@material-ui/core";
import React, { useState } from "react";
import { EmployeeEditRequestBody } from "../../../state/ducks/auth/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
import { AsyncState } from "../../../state/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import AvatarContainer from "../../components/icons/avatar/avatar.container";
import DialogContent from "./dialog/DialogContent";
import DialogTitle from "./dialog/DialogTitle";

interface OwnProps {
    isOpen: boolean;
    close: () => void;
    canManageUsers: boolean;
    employeeGroups: OptionType[];
    name: string;
    avatar: string | null;
    email: string;
    editCurrentEmployee: (values: EmployeeEditRequestBody) => void;
    showEditUser: boolean;
    showEdit: () => void;
    closeEdit: () => void;
    employeeId: string;
    callbackUpdateGroups?: (values: GetEmployeeResponse) => void;
    callbackUpdateActiveStatus?: (values: GetEmployeeResponse) => void;
    asyncState: AsyncState;
    getUrl: () => void;
    slackIntegrationEnabled: boolean;
    slackTeamId: string;
    slackUserId: string;
    previewAvatar: string;
    setPreviewAvatar: (value: string) => void;
    activeStatus: boolean;
}

type Props = OwnProps;

export const UserProfilePresenter: React.FunctionComponent<Props> = ({
    isOpen,
    close,
    canManageUsers,
    employeeGroups,
    name,
    avatar,
    editCurrentEmployee,
    showEditUser,
    showEdit,
    closeEdit,
    employeeId,
    callbackUpdateGroups,
    callbackUpdateActiveStatus,
    asyncState,
    getUrl,
    slackIntegrationEnabled,
    slackTeamId,
    slackUserId,
    email,
    previewAvatar,
    setPreviewAvatar,
    activeStatus,
}) => {
    const [userInfo, setUserInfo] = useState<EmployeeEditRequestBody>({ name, avatar });
    const handleCloseEdit = () => {
        closeEdit();
        setPreviewAvatar("");
    };
    const handleCloseDialog = () => {
        close();
        handleCloseEdit();
    };

    return (
    <Dialog fullScreen={true} open={isOpen}>
        <DialogTitle
            showEditUser={showEditUser}
            name={name}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            close={handleCloseDialog}
        />
        <AvatarContainer
            avatar={avatar}
            showEditUser={showEditUser}
            previewAvatar={previewAvatar}
            setPreviewAvatar={setPreviewAvatar}
        />
        <DialogContent
            canManageUsers={canManageUsers}
            employeeGroups={employeeGroups}
            employeeId={employeeId}
            callbackUpdateGroups={callbackUpdateGroups}
            callbackUpdateActiveStatus={callbackUpdateActiveStatus}
            showEdit={showEdit}
            showEditUser={showEditUser}
            closeEdit={handleCloseEdit}
            userInfo={userInfo}
            editCurrentEmployee={editCurrentEmployee}
            slackIntegrationEnabled={slackIntegrationEnabled}
            slackTeamId={slackTeamId}
            asyncState={asyncState}
            getUrl={getUrl}
            slackUserId={slackUserId}
            email={email}
            activeStatus={activeStatus}
        />
    </Dialog>
    );
};

export default UserProfilePresenter;
