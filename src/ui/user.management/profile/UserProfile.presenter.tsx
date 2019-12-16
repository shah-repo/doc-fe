import { Dialog } from "@material-ui/core";
import React, { useState } from "react";
import { EmployeeEditRequestBody } from "../../../state/ducks/auth/types";
import { GetEmployeeResponse } from "../../../state/ducks/userManagement";
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
    editCurrentEmployee: (values: EmployeeEditRequestBody) => void;
    showEditUser: boolean;
    showEdit: () => void;
    closeEdit: () => void;
    employeeId: string;
    callbackUpdateGroups?: (values: GetEmployeeResponse) => void;
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
}) => {
    const [userInfo, setUserInfo] = useState<EmployeeEditRequestBody>({name, avatar});

    return (
    <Dialog fullScreen={true} open={isOpen}>
        <DialogTitle
            showEditUser={showEditUser}
            name={name}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            close={close}
        />
        <AvatarContainer/>
        <DialogContent
            canManageUsers={canManageUsers}
            employeeGroups={employeeGroups}
            employeeId={employeeId}
            callbackUpdateGroups={callbackUpdateGroups}
            showEdit={showEdit}
            showEditUser={showEditUser}
            closeEdit={closeEdit}
            userInfo={userInfo}
            editCurrentEmployee={editCurrentEmployee}
        />
    </Dialog>
    );
};

export default UserProfilePresenter;
