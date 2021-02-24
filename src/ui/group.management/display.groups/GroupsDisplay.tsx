import { Dialog } from "@material-ui/core";
import React from "react";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement/types";
import DialogTitle from "../dialog/DialogTitle";
import GroupsDisplayContent from "./GroupsDisplayContent";

interface OwnProps {
  closeDialog: () => void;
  isOpen: boolean;
  selectedGroup: LoadCompanyGroup;
}

type Props = OwnProps;

const GroupsDisplay: React.FunctionComponent<Props> = ({
  closeDialog,
  isOpen,
  selectedGroup,
}) => {
  const { name, employees } = selectedGroup;

  return (
    <Dialog fullScreen={true} open={isOpen}>
      <DialogTitle
        closeDialog={closeDialog}
        title={"group.management.group.details"}
      />
      <GroupsDisplayContent
        groupName={name}
        employees={employees}
      />
    </Dialog>
  );
};

export default GroupsDisplay;
