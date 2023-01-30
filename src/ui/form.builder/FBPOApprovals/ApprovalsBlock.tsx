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
  const [opened, setOpened] = useState(false);
  const toggleOpened = () => {
    setOpened((prev) => !prev);
  };

  const classes = useStyles();

  return (
    <List className={classes.list}>
      <ListItem className={classes.stateListItem} onClick={toggleOpened}>
        {opened ? <ListExpandIcon /> : <ListCollapseIcon />}
        <ListItemText>
          <Box display="flex">
            <Box
              component="span"
              flexGrow={1}
              className={classNames(classes.itemHeader, {
                [classes.expandedItemHeader]: opened,
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
      <Collapse in={opened} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </List>
  );
};


export default ApprovalsBlock;
