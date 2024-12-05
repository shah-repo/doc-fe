import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useMemo } from 'react';
import { translate } from '../../../../../../../../common/intl';
import { Button } from '../../../../../../../components/forms/fields-next';
import { CustomGroupOptions, LCP } from '../types';
import { getCellDataCyBasedOnParentDocType } from '../utils';
import useStyles from './styles';

interface AddPhaseProps {
  dataItem: LCP
  selectedPartGroups: CustomGroupOptions[]
  addPhase: (dataItem: LCP) => void
}

export const AddPhase: React.FC<AddPhaseProps> = React.memo((props) => {
  const { dataItem, selectedPartGroups, addPhase } = props;
  const classes = useStyles();

  const handleClick = useCallback(() => {
    addPhase?.(dataItem);
  }, [addPhase, dataItem]);

  const dataCy = useMemo(() =>
    getCellDataCyBasedOnParentDocType(selectedPartGroups, dataItem.documentTypeId, 'add-phase', ''),
  [selectedPartGroups, dataItem],
  );

  return (<Button
    kind="ghost"
    size="small"
    className={classes.addPhaseButton}
    startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
    onClick={handleClick}
    data-cy={`${dataCy}button`}
  >
    {translate('administration.general.settings.lcp.add.phase')}
  </Button>);
});
