import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, styled } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Field, FieldWrapper, FieldWrapperProps, Form, FormElement } from '@progress/kendo-react-form';
import { TextArea, TextAreaProps } from '@progress/kendo-react-inputs';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Text from '../../../components/Text';
import { FBSchemaProps } from '../../../form.builder';
import GridCellStyles from './CellStyles';
import './KendoStyles.css';

interface FormAreaProps extends FieldWrapperProps {
  defaultVal: string
  isEdit: boolean
}
interface TextAreaDialogProps extends TextAreaProps {
  cancelEdit: () => void
  addClick: (event) => void
  openForm: boolean
  fieldName?: string
  item: FBSchemaProps
  isEdit: boolean
}
const FormTextArea: React.FunctionComponent<FormAreaProps> = ({
  defaultVal,
  isEdit,
  ...others
}) =>
  <FieldWrapper>
    <div className="k-form-field-wrap">
      <TextArea defaultValue={defaultVal} readOnly={!isEdit}
        rows={17}
        {...others} />
    </div>
  </FieldWrapper>
;

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
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
          id="DialogContent-close"
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
export const TextareaDialog: React.FunctionComponent<TextAreaDialogProps> = ({
  fieldName,
  cancelEdit,
  openForm,
  title,
  addClick,
  item,
  isEdit,
}) => {
  const classes = GridCellStyles();
  const field = fieldName || '';

  return (
    <CustomDialog
      onClose={cancelEdit}
      open={openForm}
      fullWidth
      maxWidth="sm"
      className="gridTextAreaForm"
    >
      <CustomDialogTitle onClose={cancelEdit}>
        {title}
      </CustomDialogTitle>
      <Form
        onSubmit={addClick}
        render={() => (
          <FormElement>
            <fieldset className="k-form-fieldset">
              <DialogContent dividers>
                <Field
                  id={field}
                  name={field}
                  label={title}
                  component={FormTextArea}
                  defaultVal={
                    !isEmpty(item)
                      ? JSON.stringify(item, undefined, 4)
                      : ''
                  }
                  isEdit={isEdit}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  className={`${'k-button'} ${classes.schemaCancelBtn}`}
                  onClick={cancelEdit}
                >
                  <Text translation="common.cancel" />
                </Button>
                <Button
                  type="submit"
                  className={`${'k-button'} ${classes.schemaAddBtn}`}
                  disabled={!isEdit}
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
