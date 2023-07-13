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
import React from 'react';
import { ReactComponent as ModelCloseIcon } from '../../../../../../src/assets/images/modelClose.svg';
import { TransitionTypes } from '../../../../../state/ducks/dashboard/types';
import { AsyncState } from '../../../../../state/types';
import { FormContext } from '../../../../components/forms/FormContext';
import Text from '../../../../components/Text';
import { DialogHandler } from '../../../../hooks/useDialog';
import PasswordFormApproval from './form/PasswordForm';
import styles from './TransitionDialog.styles';
import { PasswordFormValues, Transition } from './types';

interface TransitionDialogProps {
  onSubmit: (values: PasswordFormValues) => void
  asyncState: AsyncState
  buttonProps?: ButtonProps
  transition: Transition
  label: string
  transitionDialog: DialogHandler
}

type Props = TransitionDialogProps & WithStyles<typeof styles>;

const TransitionDialog: React.FunctionComponent<Props> = ({
  classes,
  onSubmit,
  asyncState,
  transition,
  transitionDialog,
}) => {
  const renderPasswordForm = (props: FormikProps<any>) => (
    <PasswordFormApproval
      {...props}
      asyncState={asyncState}
      cancel={transitionDialog.close}
    />
  );

  const preventPropagation = (event: React.FormEvent) =>
    event.stopPropagation();
  return (
    <>
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
                <Text
                  translation={
                    transition === TransitionTypes.TRANSITION_REJECT
                      ? 'transition.action.reject.title'
                      : 'transition.action.approve.title'
                  }
                />
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
          <DialogContent className={classes.pendingBox}>
            <FormContext.Provider value={{ submitOnChange: false }}>
              <Formik initialValues={{ password: '' }} onSubmit={onSubmit}>
                {renderPasswordForm}
              </Formik>
            </FormContext.Provider>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default withStyles(styles)(TransitionDialog);
