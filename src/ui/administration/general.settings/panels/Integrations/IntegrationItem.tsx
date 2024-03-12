import { ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { Button } from '../../../../components/forms/fields-next';
import EnabledLabel from './EnabledLabel';

interface Props {
  isActive?: boolean
  isDisabled?: boolean
  onToggle?: () => void
}

const IntegrationItem: React.FC<Props> = ({
  children,
  isDisabled,
  isActive,
  onToggle,
}) => {
  return (
    <>
      <ListItemText>{children}</ListItemText>
      <ListItemSecondaryAction>
        <EnabledLabel isActive={isActive} />
        <Button
          size="small"
          kind="outlined"
          onClick={onToggle}
          disabled={isDisabled}
        >
          {translate(isActive ? 'integrations.disable' : 'integrations.enable')}
        </Button>
      </ListItemSecondaryAction>
    </>
  );
};

export default IntegrationItem;
