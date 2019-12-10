import React from 'react';
import { FBActionContainerProps } from '../../types/actions/action';
import Box from '@material-ui/core/Box/Box';
import { withActionContainer } from '../../hocs/actions/withActionContainer';

const FBActionContainer: React.FunctionComponent<FBActionContainerProps> = ({
    actions,
}) => {

  return (
      <Box>
          {actions}
      </Box>
  );
};

export default withActionContainer(FBActionContainer);
