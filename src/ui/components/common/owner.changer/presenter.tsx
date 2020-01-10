import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { Fragment } from "react";
import { Owner } from "../../../../state/ducks/common";
import { AsyncState, AsyncStatus } from "../../../../state/types";
import { SelectOption } from "../../forms/fields/Select";
import Text from "../../Text";

export interface OwnProps {
  employees: SelectOption[];
  updateOwner: any;
  currentOwner: Owner;
  asyncState: AsyncState;
  isDialogOpen: boolean;
  closeDialog: () => void;
  openDialog: () => void;
}

const OwnerChangerPresenter: React.FC<OwnProps> = ({
  employees,
  updateOwner,
  currentOwner,
  asyncState,
  isDialogOpen,
  closeDialog,
  openDialog,
}) => {
  const isActive = asyncState.status === AsyncStatus.Active;

  const preventPropagation = (event: React.FormEvent) =>
    event.stopPropagation();

  const [owner, setOwner] = React.useState(currentOwner.id);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOwner(event.target.value as string);
  };

  const dialogRenderer = () => (
    <Dialog
      open={isDialogOpen}
      onSubmit={preventPropagation}
      onClose={closeDialog}
    >
      <DialogTitle><Text  translation="change.owner" /></DialogTitle>
      <DialogContent style={{ width: 500 }}>
        <Box py={4}>
          <FormControl className="form-control" style={{ width: "100%" }}>
            <InputLabel id="employee-select"><Text translation="common.employees" /></InputLabel>
            <Select name="employees" defaultValue={owner} onChange={handleChange}>
              {employees.map((option) => (
                <MenuItem key={option.value} value={option.value}> {option.text}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box py={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
            <Button disabled={isActive} variant="contained" color="primary" onClick={() => updateOwner(owner)}>
              {isActive && <CircularProgress size={15} color="primary" />}
              <Text translation="change.owner.update" />
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Fragment>
      <Button variant="outlined" onClick={openDialog}> <Text translation="change.owner" /></Button>
      {dialogRenderer()}
    </Fragment>
  );
};

export default OwnerChangerPresenter;
