import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import React, { Fragment } from "react";
import Select from "react-select";
import useDialog from "../../../hooks/useDialog";

export interface OwnProps {
  employees: any;
  updateOwner: any;
}

const OwnerChangerPresenter: React.FC<OwnProps> = ({ employees, updateOwner }) => {
  const dialog = useDialog();
  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const openDialog = () => dialog.open();
  const options = employees.map((employee) => ({value: employee.id, text: employee.user.name }));

  const dialogRenderer = () => (
    <Dialog
      open={dialog.isOpen}
      onSubmit={preventPropagation}
      onClose={dialog.close}
    >
      <DialogTitle>
        Select Owner
      </DialogTitle>
      <DialogContent>
        <Select options={options}/>
        <Button onClick={updateOwner}>Change Owner</Button>
      </DialogContent>
    </Dialog>
  );

  return (
  <Fragment>
      <Button onClick={openDialog}>Change Owner</Button>
      {dialogRenderer()}
  </Fragment>);
};

export default OwnerChangerPresenter;
