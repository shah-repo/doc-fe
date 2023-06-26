import { Box, Button, Grid, Typography } from '@material-ui/core';
import { Form } from 'formik';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../../state/ducks/auth';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { AsyncState, AsyncStatus } from '../../../../../state/types';
import InputField from '../../../../components/forms/fields/Input';
import { required, validator } from '../../../../components/forms/fields/validators';
import FormMessage from '../../../../components/forms/FormMessage';
import FormProgress from '../../../../components/forms/FormProgress';
import SubmitButton from '../../../../components/forms/SubmitButton';
import Text from '../../../../components/Text';
import { styles } from './styles';

interface Props {
  asyncState: AsyncState
  cancel: () => void
  docDetails: Partial<DocumentRevision>
  trId?: string
}

const TrainingForm: React.FunctionComponent<Props> = ({
  cancel,
  asyncState,
  docDetails,
  trId = '-',
}) => {
  const currentUser = useSelector(authSelectors.currentUserName);
  const classes = styles();

  return (
    <Form>
      <FormMessage asyncState={asyncState} />
      <Grid container>
        <Grid item xs={6}>
          <Grid item xs={12} className={classes.item}>
            <Typography className={classes.label}>
              <Text translation="training.trn.id" />
              <Box className={classes.itemContentBlue}>
                {trId}
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <Typography className={classes.label}>
              <Text translation="training.doc.id.rev" />
            </Typography>
            <Box className={classes.itemContentBlue}>
              {docDetails.docId}&nbsp;
             Rev &nbsp;
              {docDetails.displayRevision}
            </Box>
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <Typography className={classes.label}>
              <Text translation="common.title" />
            </Typography>
            <Box>
              {docDetails.name}
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={6} >
          <Grid item xs={12} className={classes.item}>
            <span className={classes.label}>
              <Text translation="training.acknowledge.statement" />
            </span>
            <span className={classes.itemContentBlue}>
             &nbsp; {docDetails.docId}&nbsp;
             Rev &nbsp;
              {docDetails.displayRevision}
            </span>
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <Box>
              <span className={classes.itemContentBlue}>
                {currentUser}
              </span> | Trainee
            </Box>
          </Grid>
          <Grid item xs={12} className={classes.item}>
            <InputField
              name="password"
              label="training.acknowladge.password"
              dataCy="training.acknowladge.password"
              inputProps={{ type: 'password', className: classes.root }}
              validate={validator(required)}
              size="sm"
            />
            <FormProgress asyncState={asyncState} />
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="text"
                color="secondary"
                data-cy="reject.request"
                disabled={asyncState.status === AsyncStatus.Active}
                onClick={cancel}
              >
                <Text translation="transition.action.cancel" />
              </Button>
              <SubmitButton
                id="passwordConfirm"
                dataCy="passwordConfirm"
                asyncState={asyncState}
                label="common.acknowledge"
                fullWidth={false}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  ); };

export default TrainingForm;
