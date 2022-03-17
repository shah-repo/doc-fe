import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Form, Formik } from "formik";
import React from "react";
import { StyledButton } from "../../../../App/Shifamed/Components/forms/presenters/StyledListButton";
import { StyledMenuListIcon } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListIcon";
import { StyledMenuListItem } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListItem";
import { StyledMenuListItemText } from "../../../../App/Shifamed/Components/forms/presenters/StyledMenuListITemText";
import { ReactComponent as ChangeOwnerIcon } from "../../../../assets/images/change_owner_avatar.svg";
import { Owner } from "../../../../state/ducks/common/types";
import { AsyncState } from "../../../../state/types";
import SelectField, { SelectOption } from "../../forms/fields/Select";
import { FormContext } from "../../forms/FormContext";
import FormMessage from "../../forms/FormMessage";
import FormProgress from "../../forms/FormProgress";
import SubmitButton from "../../forms/SubmitButton";
import Text from "../../Text";
import { styles } from "./styles";

interface OwnProps {
  employees: SelectOption[];
  updateOwner: any;
  currentOwner: Owner;
  asyncState: AsyncState;
  isDialogOpen: boolean;
  closeDialog: () => void;
  openDialog: () => void;
  renderAsButton: boolean;
  newVariant: boolean;
}

const OwnerChangerPresenter: React.FC<OwnProps> = ({
  employees,
  updateOwner,
  currentOwner,
  asyncState,
  isDialogOpen,
  closeDialog,
  openDialog,
  renderAsButton,
  newVariant,
}) => {
  const classes = styles();
  const preventPropagation = (event: React.FormEvent) =>
    event.stopPropagation();

  const renderForm = () => (
    <Box py={4}>
      <Form>
        <FormProgress asyncState={asyncState} />
        <FormMessage asyncState={asyncState} />
        <FormControl className={`form-control ${classes.formControl}`} id="OwnerChangerPresenter-selectField">
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
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <Typography variant="h6"><Text translation="change.owner" /></Typography>
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
      {renderAsButton && newVariant && (
        <StyledButton
          color="primary"
          id="OwnerChangerPresenter-changeOwner"
          data-cy="changeOwner"
          onClick={openDialog}
        >
          <Text translation="change.owner" />
        </StyledButton>
      )}
      {renderAsButton && !newVariant && (
        <Button
          color="secondary"
          variant="outlined"
          onClick={openDialog}
          id="OwnerChangerPresenter-changeOwner"
          data-cy="changeOwner" >
          <Text translation="change.owner" />
        </Button>
      )}
      {!renderAsButton && newVariant && (
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
