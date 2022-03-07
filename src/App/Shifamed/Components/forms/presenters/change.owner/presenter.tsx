import { Box, Dialog, DialogContent, DialogTitle, FormControl, IconButton, ListItemText, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Form, Formik } from "formik";
import React, { Fragment } from "react";
import { ReactComponent as ChangeOwnerIcon } from "../../../../../../assets/images/change_owner_avatar.svg";
import { Owner } from "../../../../../../state/ducks/common/types";
import { AsyncState } from "../../../../../../state/types";
import SelectField, { SelectOption } from "../../../../../../ui/components/forms/fields/Select";
import { FormContext } from "../../../../../../ui/components/forms/FormContext";
import FormMessage from "../../../../../../ui/components/forms/FormMessage";
import FormProgress from "../../../../../../ui/components/forms/FormProgress";
import SubmitButton from "../../../../../../ui/components/forms/SubmitButton";
import Text from "../../../../../../ui/components/Text";
import { StyledMenuListIcon } from "../StyledMenuListIcon";
import { StyledMenuListItem } from "../StyledMenuListItem";


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
      <StyledMenuListItem  button alignItems="flex-start">
        <StyledMenuListIcon>
          <ChangeOwnerIcon />
        </StyledMenuListIcon>
        <ListItemText
          id="OwnerChangerPresenter-changeOwner"
          data-cy="changeOwner"
          primary={<Text translation="change.owner" />}
          onClick={openDialog}
          style={{
            fontFamily: "Sora",
            fontSize: "14px",
          }}
        />
      </StyledMenuListItem>
      {dialogRenderer()}
    </Fragment>
  );
};

export default OwnerChangerPresenter;
