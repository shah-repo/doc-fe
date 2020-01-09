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
import useDialog from "../../../hooks/useDialog";
import { SelectOption } from "../../forms/fields/Select";
import Text from "../../Text";

export interface OwnProps {
  employees: SelectOption[];
  updateOwner: any;
  currentOwner: Owner;
  loading: boolean;
}

const OwnerChangerPresenter: React.FC<OwnProps> = ({
  employees,
  updateOwner,
  currentOwner,
  loading,
}) => {
  const dialog = useDialog();
  const openDialog = () => dialog.open();
  const preventPropagation = (event: React.FormEvent) =>
    event.stopPropagation();

  const [owner, setOwner] = React.useState(currentOwner.id);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOwner(event.target.value as string);
  };

  const dialogRenderer = () => (
    <Dialog
      open={dialog.isOpen}
      onSubmit={preventPropagation}
      onClose={dialog.close}
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
            <Button disabled={loading} variant="contained" color="primary" onClick={() => updateOwner(owner)}>
              {loading && <CircularProgress size={15} color="primary" />}
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
