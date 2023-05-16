import { Box, Button } from '@material-ui/core';
import classNames from 'classnames';
import React, { useState } from 'react';
// import { ReactComponent as TriangleDown } from "../../../assets/images/triangle-down.svg";
import { ReactComponent as TriangleDown } from '../../../../assets/images/triangle-down.svg';
import { styles } from './ExpandableTemplate.styles';

interface Props {
  items: string[];
  dataId: string;
  noOfItems?: number;
}
const ExpandableTemplate = ({ items, dataId, noOfItems = 15  }: Props) => {
  const classes = styles();
  const groupId = dataId;
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const handleExpandMembers = (e: React.MouseEvent<HTMLButtonElement>, groupId: string) => {
    e.stopPropagation();
    setExpandedGroupId(groupId === expandedGroupId ? null : groupId);
  };
  const itemsToDisplay = groupId === expandedGroupId ? items : items.slice(0, noOfItems);
  const remainder = groupId === expandedGroupId ? 0 : items.length - noOfItems;
  return (
    <Box justifyContent="flex-start" alignContent="flex-start">
      {itemsToDisplay.join(', ')}
      {
        items.length > noOfItems && (
          <>
            {groupId !== expandedGroupId && '...'}
            <Button
              color="primary"
              variant="contained"
              className={classes.remainderButton}
              onClick={(e) => handleExpandMembers(e, groupId)}
            >
              {remainder}
              <TriangleDown className={classNames({
                [classes.triangleDown]: true,
                expanded: groupId === expandedGroupId,
              })}/>
            </Button>
          </>
        )
      }
    </Box>
  );
};

export default ExpandableTemplate;
