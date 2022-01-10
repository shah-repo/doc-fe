import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Field, FieldWrapper, FieldWrapperProps, Form, FormElement } from "@progress/kendo-react-form";
import { TextArea, TextAreaProps } from "@progress/kendo-react-inputs";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import Text from "../../../components/Text";
import GridCellStyles from "./CellStyles";
import "./KendoStyles.css";

interface FormAreaProps extends FieldWrapperProps {
  defaultVal: string;
  isEdit: boolean;
}
interface TextAreaDialogProps extends TextAreaProps {
  cancelEdit: () => void;
  addClick: (event: any) => void;
  openForm: boolean;
  fieldName: string | undefined;
  item: any;
  isEdit: boolean;
}
const FormTextArea = (fieldRenderProps: FormAreaProps) => {
  const {
    defaultVal,
    isEdit,
    ...others
  } = fieldRenderProps;
  return <FieldWrapper>
    <div className={"k-form-field-wrap"}>
      <TextArea defaultValue={defaultVal}
        rows={17}
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
export const TextareaDialog = (props: TextAreaDialogProps) => {
  const classes = GridCellStyles();
  const fieldName = props.fieldName || "";

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
      <Form
        onSubmit={props.addClick}
        render={() => (
          <FormElement>
            <fieldset className={"k-form-fieldset"}>
              <DialogContent dividers>
                <Field
                  id={fieldName}
                  name={fieldName}
                  label={props.title}
                  component={FormTextArea}
                  defaultVal={
                    !isEmpty(props.item)
                      ? JSON.stringify(props.item, undefined, 4)
                      : ""
                  }
                  isEdit={props.isEdit}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  className={`${"k-button"} ${classes.schemaCancelBtn}`}
                  onClick={props.cancelEdit}
                >
                  <Text translation="common.cancel" />
                </Button>
                <Button
                  type="submit"
                  className={`${"k-button"} ${classes.schemaAddBtn}`}
                  disabled={!props.isEdit}
                >
                  <Text translation="common.add" />
                </Button>
              </DialogActions>
            </fieldset>
          </FormElement>
        )}
      />
    </CustomDialog>
  );
};
