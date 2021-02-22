import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Form, Formik } from "formik";
import React, { Fragment } from "react";
import { Owner } from "../../../../state/ducks/common";
import { AsyncState } from "../../../../state/types";
import SelectField, { SelectOption } from "../../forms/fields/Select";
import { FormContext } from "../../forms/FormContext";
import FormMessage from "../../forms/FormMessage";
import FormProgress from "../../forms/FormProgress";
import SubmitButton from "../../forms/SubmitButton";
import Text from "../../Text";

interface OwnProps {
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
  const preventPropagation = (event: React.FormEvent) =>
    event.stopPropagation();

  const renderForm = () => (
    <Box py={4}>
      <Form>
        <FormProgress asyncState={asyncState} />
        <FormMessage asyncState={asyncState} />
        <FormControl className="form-control" style={{ width: "100%" }} id="OwnerChangerPresenter-selectField">
          <SelectField
            selectProps={{ id: "employee" }}
            name="employee"
            includeEmpty={false}
            options={employees}
          />
        </FormControl>
        <Box
          py={1}
          display="flex"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <SubmitButton asyncState={asyncState}
            label="change.owner.update"
            id="OwnerChangerPresenter-submitButton"
            data-cy="changeOwner-submit" />
        </Box>
      </Form>
    </Box>
  );

  const dialogRenderer = () => (
    <Dialog
      open={isDialogOpen}
      onSubmit={preventPropagation}
      onClose={closeDialog}
    >
      <DialogTitle disableTypography style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6"><Text translation="change.owner" /></Typography>
        <IconButton onClick={closeDialog} style={{ padding: 0 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ width: 500 }}>
        <FormContext.Provider value={{ submitOnChange: false }}>
          <Formik
            initialValues={{ employee: currentOwner.id }}
            onSubmit={updateOwner}
          >
            {renderForm}
          </Formik>
        </FormContext.Provider>
      </DialogContent>
    </Dialog>
  );

  return (
    <Fragment>
      <Button
        color="secondary"
        variant="outlined"
        onClick={openDialog}
        id="OwnerChangerPresenter-changeOwner"
        data-cy="changeOwner" >
        <Text translation="change.owner" />
      </Button>
      {dialogRenderer()}
    </Fragment>
  );
};

export default OwnerChangerPresenter;
