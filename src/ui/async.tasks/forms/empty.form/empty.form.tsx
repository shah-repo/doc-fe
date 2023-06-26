import { Box, Button } from '@material-ui/core';
import React from 'react';
import Text from '../../../components/Text';
import { styles } from './empty.form.styles';

interface Props {
  handleEmptyFormSubmit: () => void
}
const EmptyAsyncTaskPresenter: React.FunctionComponent<Props> = ({
  handleEmptyFormSubmit,
}) => {
  const classes = styles();
  return (
    <Box className={classes.root}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={handleEmptyFormSubmit}
          variant="contained"
          color="secondary"
        >
          <Text translation="common.submit" />
        </Button>
      </Box>
    </Box>
  );
};
export default EmptyAsyncTaskPresenter;
