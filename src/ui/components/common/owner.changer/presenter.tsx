import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import React, { Fragment } from 'react';
import useDialog from '../../../hooks/useDialog';
import { authSelectors } from '../../../../state/ducks/auth';
import { useSelector } from 'react-redux';

export interface OwnProps {
  employees: any;
  updateOwner: any;
}

const OwnerChangerPresenter: React.FC<OwnProps> = ({
  employees,
  updateOwner,
}) => {
  const dialog = useDialog();
  const preventPropagation = (event: React.FormEvent) =>
    event.stopPropagation();
  const openDialog = () => dialog.open();

  const currentUser = useSelector(authSelectors.currentEmployeeId);

  const [owner, setOwner] = React.useState(currentUser);
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOwner(event.target.value as string);
  };

  const dialogRenderer = () => (
    <Dialog
      open={dialog.isOpen}
      onSubmit={preventPropagation}
      onClose={dialog.close}
    >
      <DialogTitle>Select Owner</DialogTitle>
      <DialogContent style={{ width: 500 }}>
        <Box py={4}>
          <FormControl className="form-control" style={{ width: '100%' }}>
            <InputLabel id="employee-select">Employees</InputLabel>
            <Select name="employees" value={owner} onChange={handleChange}>
              {employees.map(option => (
                <MenuItem value={option.value}> {option.text}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box py={1} flex alignItems="flex-end">
            <Button variant="contained" color="primary" onClick={updateOwner}>
              Change Owner
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Fragment>
      <Button onClick={openDialog}>Change Owner</Button>
      {dialogRenderer()}
    </Fragment>
  );
};

export default OwnerChangerPresenter;
