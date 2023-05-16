import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { FBProvider, FBSortableProps } from '..';
import { withFBSortable } from './FBSortable.wrap';

const FBSortable: React.FunctionComponent<FBSortableProps> = ({
  items,
  sortableState,
  ...props
}) => {
  const SortableList = SortableContainer(() => (
    <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
      {items}
    </ul>
  ));
  return (
    <FBProvider { ...{ sortableState }}>
      <SortableList
        {...props}
        axis="y"
        lockAxis="y"
        pressDelay={200}
        lockToContainerEdges
        lockOffset={['5%', '100%']}
      />
    </FBProvider>
  );
};

export default withFBSortable(FBSortable);
