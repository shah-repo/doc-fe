import { Box, Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import classNames from "classnames";
import React, { useState } from "react";
import { ReactComponent as ListCollapseIcon } from "../../../assets/images/list_collapse.svg";
import { ReactComponent as ListExpandIcon } from "../../../assets/images/list_expand.svg";
import Text from "../../../ui/components/Text";
import useStyles from "./FBPOApprovals.styles";

const ApprovalsBlock: React.FC<{
  headerText: string;
  itemsCount: number;
}> = ({
  headerText,
  itemsCount,
  children,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const toggleOpened = () => {
    setIsOpened((prev) => !prev);
  };

  const classes = useStyles();

  return (
    <List className={classes.list}>
      <ListItem className={classes.stateListItem} onClick={toggleOpened}>
        {isOpened ? <ListExpandIcon /> : <ListCollapseIcon />}
        <ListItemText>
          <Box display="flex" alignItems="center">
            <Box
              component="span"
              flexGrow={1}
              className={classNames(classes.itemHeader, {
                [classes.expandedItemHeader]: isOpened,
              })}
            >
              <Text message={headerText} />
            </Box>
            <Box
              component="span"
              justifyContent="flex-end"
              className={classes.itemCount}
            >
              <Text
                translation="common.items.count"
                values={{
                  count: itemsCount,
                }}
              />
            </Box>
          </Box>
        </ListItemText>
      </ListItem>
      <Collapse in={isOpened} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </List>
  );
};


export default ApprovalsBlock;
