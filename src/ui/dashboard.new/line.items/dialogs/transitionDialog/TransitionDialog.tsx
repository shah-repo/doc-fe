import {
  Box,
  ButtonProps,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { Formik, FormikProps } from 'formik';
import moment from 'moment';
import React from 'react';
import { ReactComponent as ModelCloseIcon } from '../../../../../../src/assets/images/modelClose.svg';
import { TransitionTypes } from '../../../../../state/ducks/dashboard/types';
import { AsyncState } from '../../../../../state/types';
import AlertDialog from '../../../../app/alert.dialog/AlertDialog';
import { EffectiveDateFormValues } from '../../../../change.request/form/types';
import { FormContext } from '../../../../components/forms/FormContext';
import Text from '../../../../components/Text';
import { DialogHandler } from '../../../../hooks/useDialog';
import ClosedActionForm from './form/ClosedActionForm';
import EffectiveDateForm from './form/EffectiveDateForm';
import PasswordFormApproval from './form/PasswordForm';
import styles from './TransitionDialog.styles';
import { PasswordFormValues, Transition } from './types';

interface TransitionDialogProps {
  onSubmit: (values: PasswordFormValues | EffectiveDateFormValues) => void;
  asyncState: AsyncState;
  arId?: string;
  title?: string;
  buttonProps?: ButtonProps;
  transition: Transition;
  label: string;
  hideLabel?: boolean;
  transitionDialog: DialogHandler;
  effectiveDateDialog?: DialogHandler;
}

type Props = TransitionDialogProps & WithStyles<typeof styles>;

const TransitionDialog: React.FunctionComponent<Props> = ({
  arId,
  title,
  classes,
  onSubmit,
  asyncState,
  transition,
  transitionDialog,
  hideLabel,
  effectiveDateDialog,
}) => {
  const renderPasswordForm = (props: FormikProps<any>) => (
    <PasswordFormApproval
      {...props}
      asyncState={asyncState}
      cancel={transitionDialog.close}
    />
  );

  const isClosedTransition =
    transition === TransitionTypes.TRANSITION_CLOSED ? true : false;

  const renderCloseForm = (props: FormikProps<any>) => (
    <ClosedActionForm
      {...props}
      arId={arId}
      title={title}
      asyncState={asyncState}
      cancel={transitionDialog.close}
    />
  );

  const renderCloseDateForm = (props: FormikProps<any>) => (
    <EffectiveDateForm
      {...props}
      asyncState={asyncState}
      cancel={transitionDialog.close}
    />
  );

  const preventPropagation = (event: React.FormEvent) =>
    event.stopPropagation();
  return (
    <>
      {effectiveDateDialog && (
        <AlertDialog
          dialog={effectiveDateDialog}
          confirmAction={() =>
            onSubmit({ effectiveDate: moment.utc().toISOString() })
          }
          cancelAction={() => {
            effectiveDateDialog.close();
            transitionDialog.open();
          }}
          message={'transition.action.effective.date.message'}
          confirmLabel={'common.true'}
          cancelLabel={'common.false'}
        />
      )}
      <Dialog
        disableEscapeKeyDown={true}
        disableBackdropClick={true}
        open={transitionDialog.isOpen}
        onSubmit={preventPropagation}
      >
        <Box component="div" className={classes.paper}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography
                variant="h2"
                component="h2"
                id="simple-modal-title"
                className={classes.modeltitle}
              >
                {!hideLabel && <Text
                  translation={
                    transition === TransitionTypes.TRANSITION_CLOSED
                      ? 'transition.action.close.title'
                      : transition === TransitionTypes.TRANSITION_REJECT
                        ? 'transition.action.reject.title'
                        : 'transition.action.approve.title'
                  }
                />}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="close"
                className={classes.closemodel}
                onClick={transitionDialog.close}
              >
                <ModelCloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <DialogContent
            className={
              !isClosedTransition
                ? classes.pendingBox
                : classes.closedDialogueContent
            }
          >
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik
                initialValues={
                  transition === TransitionTypes.TRANSITION_CLOSED
                    ? { effectiveDate: moment.utc().toISOString() }
                    : { password: '' }
                }
                onSubmit={onSubmit}
              >
                {transition === TransitionTypes.TRANSITION_CLOSED
                  ? renderCloseForm
                  : renderPasswordForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
          {isClosedTransition && (
            <>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography
                    variant="h2"
                    component="h2"
                    id="simple-modal-title"
                    className={classes.modeltitle}
                  >
                    <Text translation="transition.action.cancel.schedule.title" />
                  </Typography>
                </Grid>
              </Grid>
              <DialogContent className={classes.closedDialogueContent}>
                <FormContext.Provider value={{ submitOnChange: false }}>
                  <Formik
                    initialValues={
                      transition === TransitionTypes.TRANSITION_CLOSED
                        ? { effectiveDate: '' }
                        : { password: '' }
                    }
                    onSubmit={onSubmit}
                  >
                    {renderCloseDateForm}
                  </Formik>
                </FormContext.Provider>
              </DialogContent>
            </>
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default withStyles(styles)(TransitionDialog);
