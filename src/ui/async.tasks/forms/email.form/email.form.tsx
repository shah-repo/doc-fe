import { Box, Button, TextField } from '@material-ui/core';
import React from 'react';
import Text from '../../../components/Text';
import { styles } from './email.form.styles';

interface Props {
  handleEmailFormSubmit: (id: string) => void;
  type: string;
}
const EmailAsyncTaskPresenter: React.FunctionComponent<Props> = ({
  handleEmailFormSubmit,
  type,
}) => {
  const classes = styles();
  const [email, setEmail] = React.useState('');
  const handleUserEmailsChange = (event: any) => {
    setEmail(event?.target?.value);
  };
  return (
    <Box mt={2} className={classes.root}>
      <Box display="flex" justifyContent="flex-start">
        <TextField
          id="filled-textarea"
          label={
            <Text
              translation={'async.tasks.user.email'}
            />
          }
          multiline
          onChange={handleUserEmailsChange}
          value={email}
          variant="filled"
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          onClick={() => {
            handleEmailFormSubmit(email);
          }}
        >
          <Text translation={'common.submit'} />
        </Button>
      </Box>
    </Box>
  );
};
export default EmailAsyncTaskPresenter;
