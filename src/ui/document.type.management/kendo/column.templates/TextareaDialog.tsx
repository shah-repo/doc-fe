import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Field, FieldWrapper, Form, FormElement } from "@progress/kendo-react-form";
import { TextArea } from "@progress/kendo-react-inputs";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import GridCellStyles from "./CellStyles";
import "./KendoStyles.css";

const FormTextArea = (fieldRenderProps) => {
  const {
    validationMessage,
    touched,
    label,
    id,
    valid,
    disabled,
    hint,
    type,
    optional,
    defaultV,
    isEdit,
    ...others
  } = fieldRenderProps;
  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hindId = showHint ? `${id}_hint` : "";
  const errorId = showValidationMessage ? `${id}_error` : "";

  return <FieldWrapper>
    <div className={"k-form-field-wrap"}>
      <TextArea defaultValue={defaultV} valid={valid}
        type={type} id={id} disabled={disabled}
        rows={17} ariaDescribedBy={`${hindId} ${errorId}`}
        {...others} />
    </div>
  </FieldWrapper>;
};

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CustomDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  const classes = GridCellStyles();
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          onClick={onClose}
          className={classes.closeButton}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

CustomDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
export const TextareaDialog = (props) => {
  const classes = GridCellStyles();
  const fieldName = props.fieldName;

  return (
    <CustomDialog
      onClose={props.cancelEdit}
      open={props.openForm}
      fullWidth
      maxWidth="sm"
      className="gridTextAreaForm"
    >
      <CustomDialogTitle onClose={props.cancelEdit}>
        {props.title}
      </CustomDialogTitle>
      <Form onSubmit={props.addClick} render={() => <FormElement >
        <fieldset className={"k-form-fieldset"}>
          <DialogContent dividers>
            <Field id={fieldName} name={fieldName} label={props.title}
              component={FormTextArea}
              defaultV={!isEmpty(props.item) ? JSON.stringify(props.item, undefined, 4) : ""}
              isEdit={props.isEdit} />
          </DialogContent>
          <DialogActions>
            <Button
              className={`${"k-button"} ${classes.schemaCancelBtn}`}
              onClick={props.cancelEdit}>
              Cancel
            </Button>
            <Button
              type="submit"
              className= {`${"k-button"} ${classes.schemaAddBtn}`}
              disabled={!props.isEdit}
            >Add</Button>
          </DialogActions>
        </fieldset>
      </FormElement>} />
    </CustomDialog>
  );
};
