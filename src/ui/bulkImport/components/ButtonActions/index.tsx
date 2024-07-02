import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
} from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import { Button } from '../../../components/forms/fields-next';
import Text from '../../../components/Text';
import useStyles from './styles';

interface ButtonActionsProps {
  activeStep: number
  steps: string[]
  nextSubmit?: boolean
  useBack?: boolean
  useReset?: boolean
  useHelp?: boolean
  handleNext: () => void
  handleBack: () => void
  handleReset: () => void
}

export const NeedHelpButton = () => {
  const classes = useStyles();

  return (
    <Box className={classes.helpContainer}>
      <FontAwesomeIcon
        className={classes.messageQuestionIcon}
        icon={regular('messages-question')}
      />
      <Text translation="bulkImport.approvals.needHelp" />
    </Box>
  );
};

const ButtonActions: React.FC<ButtonActionsProps> = ({ activeStep, steps, nextSubmit = false, useBack = false, useHelp = false, useReset = false, handleNext, handleBack, handleReset }) => {
  const classes = useStyles();

  return (
    <Box>
      <Box className={useHelp ? classes.containerHelp : useBack ? classes.buttonsContainerMultiBtn : classes.buttonsContainer}>
        {useHelp && <NeedHelpButton />}
        {useBack && (<Button kind="outlined" className={classes.buttonsBack} disabled={activeStep === 0} onClick={handleBack}><Text translation="common.previous" /></Button>)}
        <Button
          type={nextSubmit ? 'submit' : 'button'}
          onClick={nextSubmit ? undefined : handleNext}
          className={classes.buttonsNext}
        >
          <Text translation="common.next" />
        </Button>
      </Box>
      {useReset && (<Button onClick={handleReset}>{translate('common.reset')}</Button>)}
    </Box>
  );
};

export default ButtonActions;
