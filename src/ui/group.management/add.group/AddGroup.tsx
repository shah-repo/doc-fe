import { Dialog } from "@material-ui/core";
import React from "react";
import { LoadCompanyGroup } from "../../../state/ducks/userManagement";
import DialogTitle from "../dialog/DialogTitle";
import AddGroupContentContainer from "./AddGroupContent.container";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
  selectedGroup?: LoadCompanyGroup;
  title: any;
}

export const AddGroup: React.FunctionComponent<Props> = ({
  isOpen,
  closeDialog,
  selectedGroup,
  title,
}) => {

  return (
    <Dialog fullScreen={true} open={isOpen}>
        <DialogTitle
            closeDialog={closeDialog}
            title={title}
        />
        <AddGroupContentContainer
          selectedGroup={selectedGroup}
        />
    </Dialog>
  );
};

export default AddGroup;
