import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Button } from '../../../../../../../components/forms/fields-next';
import { LCP } from '../types';
import useStyles from './styles';

interface AddPhaseProps {
  dataItem: LCP
  addPhase: (dataItem: LCP) => void
}

export const AddPhase: React.FC<AddPhaseProps> = (props) => {
  const { dataItem, addPhase } = props;
  const handleClick = () => addPhase?.(dataItem);
  const classes = useStyles();

  return (<Button
    kind="ghost"
    size="small"
    className={classes.addPhaseButton}
    startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
    onClick={handleClick}
    data-cy="add-phase-small-btn"
  >
    {translate('administration.general.settings.lcp.add.phase')}
  </Button>);
};
