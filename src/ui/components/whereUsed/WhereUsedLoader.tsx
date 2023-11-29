import React from 'react';
import Text from '../Text';
import useStyles from './whereUsedTree.styles';

export const WhereUsedLoader: React.FC = () => {
  const classes = useStyles({ size: undefined });
  return (
    <div data-cy="tree-items-loader" className={classes.loader}>
      <Text translation="common.loading" />
    </div>
  );
};
