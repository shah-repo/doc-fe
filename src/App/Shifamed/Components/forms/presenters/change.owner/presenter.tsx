import { Box, Dialog, DialogContent, DialogTitle, FormControl, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Form, Formik } from "formik";
import React from "react";
import { ReactComponent as ChangeOwnerIcon } from "../../../../../../assets/images/change_owner_avatar.svg";
import { Owner } from "../../../../../../state/ducks/common/types";
import { AsyncState } from "../../../../../../state/types";
import SelectField, { SelectOption } from "../../../../../../ui/components/forms/fields/Select";
import { FormContext } from "../../../../../../ui/components/forms/FormContext";
import FormMessage from "../../../../../../ui/components/forms/FormMessage";
import FormProgress from "../../../../../../ui/components/forms/FormProgress";
import SubmitButton from "../../../../../../ui/components/forms/SubmitButton";
import Text from "../../../../../../ui/components/Text";
import { StyledButton } from "../StyledListButton";
import { StyledMenuListIcon } from "../StyledMenuListIcon";
import { StyledMenuListItem } from "../StyledMenuListItem";
import { StyledMenuListItemText } from "../StyledMenuListITemText";
import { styles } from "./styles";

interface OwnProps {
  employees: SelectOption[];
  updateOwner: any;
  currentOwner: Owner;
  asyncState: AsyncState;
  isDialogOpen: boolean;
  renderAsButton: boolean;
  closeDialog: () => void;
  openDialog: () => void;
}

const OwnerChangerPresenter: React.FC<OwnProps> = ({
  employees,
  updateOwner,
  currentOwner,
  asyncState,
  isDialogOpen,
  renderAsButton,
  closeDialog,
  openDialog,
}) => {
  const classes = styles();
  const preventPropagation = (event: React.FormEvent) =>
    event.stopPropagation();

  const renderForm = () => (
    <Box py={4}>
      <Form>
        <FormProgress asyncState={asyncState} />
        <FormMessage asyncState={asyncState} />
        <FormControl
          className={`form-control ${classes.formControl}`}
          id="OwnerChangerPresenter-selectField"
        >
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
          <SubmitButton
            asyncState={asyncState}
            label="change.owner.update"
            id="OwnerChangerPresenter-submitButton"
            data-cy="changeOwner-submit"
          />
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
      <DialogTitle
        disableTypography
        className={classes.dialogTitle}
      >
        <Typography variant="h6">
          <Text translation="change.owner" />
        </Typography>
        <IconButton onClick={closeDialog} className={classes.closeIcon}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
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
    <>
      {renderAsButton && (
        <StyledButton
          color="primary"
          id="OwnerChangerPresenter-changeOwner"
          data-cy="changeOwner"
          onClick={openDialog}
        >
          <Text translation="change.owner" />
        </StyledButton>
      )}
      {!renderAsButton && (
        <StyledMenuListItem button alignItems="flex-start">
          <StyledMenuListIcon>
            <ChangeOwnerIcon />
          </StyledMenuListIcon>
          <StyledMenuListItemText
            id="OwnerChangerPresenter-changeOwner"
            data-cy="changeOwner"
            primary={<Text translation="change.owner" />}
            onClick={openDialog}
          />
        </StyledMenuListItem>
      )}
      {dialogRenderer()}
    </>
  );
};

export default OwnerChangerPresenter;
