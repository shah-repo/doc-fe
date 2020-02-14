import React from "react";
import { Dialog } from "@material-ui/core";
import DialogTitle from "../dialog/DialogTitle";
import Text from "../../components/Text";
import { GroupsDisplayContent } from "./GroupsDisplayContent";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement";

interface OwnProps {
    closeDialog: () => void;
    isOpen: boolean;
    selectedGroup: LoadCompanyGroup;
}

export type Props = OwnProps;

export const GroupsDisplay: React.FunctionComponent<Props> = ({
    closeDialog,
    isOpen,
    selectedGroup,
}) => {
    const { name, employees } = selectedGroup;
    
    return (
        <Dialog fullScreen={true} open={isOpen}>
            <DialogTitle
                closeDialog={closeDialog}
                title={<Text translation={"group.management.group.details"} />}
            />
            <GroupsDisplayContent
                groupName={name}
                employees={employees}
            />
        </Dialog>
    );
}

export default GroupsDisplay;