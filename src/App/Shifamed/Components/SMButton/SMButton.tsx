import { Button } from '@material-ui/core';
import React from 'react';
import { SMButtonProps, SMText } from '../../..';

const SMButton: React.FunctionComponent<SMButtonProps> = ({
  label = '',
  color = 'secondary',
  variant = 'contained',
  dataCy = 'fb-control-btn',
  hidden,
  style,
  ...props
}) => (
  <Button
    {...{ color, variant }}
    {...props}
    type="button"
    data-cy={dataCy}
    style={{
      ...style,
      ...hidden && { display: 'none' },
    }}
  >
    <SMText label={label} />
  </Button>
);

export default SMButton;
