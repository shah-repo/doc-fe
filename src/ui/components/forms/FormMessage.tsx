import { FormHelperTextProps } from '@material-ui/core/FormHelperText';
import * as React from 'react';
import { AsyncState } from '../../../state/types';
import { toastError } from '../notifications';

export interface FormMessageProps extends FormHelperTextProps {
  asyncState: AsyncState;
}

const FormMessage: React.FunctionComponent<FormMessageProps> = ({ asyncState, ...formHelperTextProps }) => {
  React.useEffect(() => {
    if (asyncState.message) {
      toastError(asyncState.message);
    }
  }, [asyncState.message]);

  return null;
};

export default FormMessage;
