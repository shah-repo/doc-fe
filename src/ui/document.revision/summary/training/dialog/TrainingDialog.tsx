import { Button, createStyles, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Theme, Typography } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { Formik, FormikProps } from 'formik';
import React from 'react';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { AsyncState } from '../../../../../state/types';
import { EffectiveDateFormValues } from '../../../../change.request/form/types';
import { FormContext } from '../../../../components/forms/FormContext';
import Text from '../../../../components/Text';
import { PasswordFormValues, Transition } from '../../../../components/transitionDialog/types';
import { DialogHandler } from '../../../../hooks/useDialog';
import Colors from '../../../../layout/theme/utils/colors';
import TrainingForm from './TrainingForm';

interface Props {
  onSubmit: (values: PasswordFormValues | EffectiveDateFormValues) => void
  openDialog: () => void
  asyncState: AsyncState
  buttonProps?: ButtonProps
  transition: Transition
  label: string
  transitionDialog: DialogHandler
  docDetails: Partial<DocumentRevision>
  trId?: string
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    dialogContent: {
      padding: '25px',
    },
    dialogTitle: {
      fontSize: '1.5rem',
      color: Colors.black,
      fontWeight: 500,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  },
  ));

const TrainingDialog: React.FunctionComponent<Props>
  = ({
    onSubmit,
    openDialog,
    asyncState,
    buttonProps,
    transition,
    label,
    transitionDialog,
    docDetails,
    trId,
  }) => {
    const classes = styles();
    const preventPropagation = (event: React.FormEvent) =>  event.stopPropagation();

    const renderForm = (props: FormikProps<any>) => (
      <TrainingForm
        asyncState={asyncState}
        cancel={transitionDialog.close}
        docDetails={docDetails || {}}
        trId={trId}
        {...props}
      />
    );

    return (
      <>
        <Button
          color= "secondary"
          variant= "outlined"
          aria-label={transition}
          onClick={openDialog}
          data-cy={`training-${transition}`}
          {...buttonProps}
        >
          <Text message={label} />
        </Button>
        <Dialog
          disableBackdropClick={true}
          open={transitionDialog.isOpen}
          onSubmit={preventPropagation}
          classes={{ paper: classes.dialogContent }}
          fullWidth
          maxWidth="md"
        >
          <IconButton className={classes.closeButton} onClick={transitionDialog.close}>
            <CloseIcon />
          </IconButton>
          <DialogTitle>
            <Typography className={classes.dialogTitle}>
              <Text translation="training.acknowledge.completion" />
            </Typography>
          </DialogTitle>

          <DialogContent>
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={{ password: '' }}
                onSubmit={onSubmit}
              >
                {renderForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
        </Dialog>
      </>
    );
  };

export default TrainingDialog;
