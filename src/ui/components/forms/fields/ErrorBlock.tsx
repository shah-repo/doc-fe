import { FormHelperText, makeStyles } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import Colors from '../../../layout/theme/utils/colors';
import { Translation } from '../../../translations/types';

const useStyles = makeStyles((theme) => ({
  error: {
    color: Colors.latest_red_varient,
  },
}));

interface Props {
  label: Translation
  isErrored: boolean
}

const ErrorBlock: React.FC<Props> = ({ label, isErrored }) => {
  const classes = useStyles();

  if (!isErrored) {
    return null;
  }

  return (
    <FormHelperText className={classes.error}>
      {translate('common.field.required', { label })}
    </FormHelperText>
  );
};

export default ErrorBlock;
