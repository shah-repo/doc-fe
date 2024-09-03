import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Button } from '../../../../../../../components/forms/fields-next';
import { CustomGroupOptions, LCP } from '../types';
import useStyles from './styles';

interface AddPhaseProps {
  dataItem: LCP
  selectedPartGroups: CustomGroupOptions[]
  addPhase: (dataItem: LCP) => void
}

export const AddPhase: React.FC<AddPhaseProps> = (props) => {
  const { dataItem, selectedPartGroups, addPhase } = props;
  const handleClick = () => addPhase?.(dataItem);
  const classes = useStyles();
  const selectedGroup = selectedPartGroups?.find((group: CustomGroupOptions) => dataItem.documentTypeId === group.value);

  return (<Button
    kind="ghost"
    size="small"
    className={classes.addPhaseButton}
    startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
    onClick={handleClick}
    data-cy={ `${selectedGroup?.docTypeAcronym}add-phase`}
  >
    {translate('administration.general.settings.lcp.add.phase')}
  </Button>);
};
