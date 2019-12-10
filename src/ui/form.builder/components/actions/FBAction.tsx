import React from 'react';
import { FBActionProps } from '../../types/actions/action';
import Box from '@material-ui/core/Box/Box';
import { withAction } from '../../hocs/actions/withAction';

const FBAction: React.FunctionComponent<FBActionProps> = ({
    indicators,
    actionButton,
}) => {

  return (
    <Box borderBottom={1} pb={2} mb={4}>
        {indicators}
        {actionButton}
    </Box>
  );
};

export default withAction(FBAction);
