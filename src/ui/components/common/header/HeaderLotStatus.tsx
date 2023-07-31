import classNames from 'classnames';
import React from 'react';
import { LotStatusLabelMapping, LotStatusType } from '../../../../state/ducks/documentRevisions/types';
import Text from '../../../../ui/components/Text';
import useStyles from './HeaderPOStatus.styles';
import { StyledPOStatusButton } from './HeaderPOStatusButton';

interface Props {
  lotStatus: LotStatusType
}

const HeaderPOStatus: React.FC<Props> = ({ lotStatus }) => {
  const classes = useStyles();
  return (
    <StyledPOStatusButton type="submit" color="primary" disableRipple>
      <div data-cy={`po-status-button-${lotStatus}`} className={classNames(classes.statusIcon,
        classes[lotStatus])} />
      <Text message={LotStatusLabelMapping[lotStatus]} />
    </StyledPOStatusButton>
  );
};

export default HeaderPOStatus;
