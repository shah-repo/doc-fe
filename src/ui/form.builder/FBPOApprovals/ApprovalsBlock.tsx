import { Box, Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import classNames from "classnames";
import React, { useState } from "react";
import { ReactComponent as ListCollapseIcon } from "../../../assets/images/list_collapse.svg";
import { ReactComponent as ListExpandIcon } from "../../../assets/images/list_expand.svg";
import Text from "../../../ui/components/Text";
import { FBInlineApprovalBody } from "../FBInlineApproval/FBInlineApproval.types";
import { styles } from "./FBPOApprovals.styles";


const ApprovalsBlock: React.FC<{
  status: string;
  approvals: FBInlineApprovalBody[];
}> = ({
  status,
  approvals,
  children,
}) => {
  const [opened, setOpened] = useState(false);
  const toggleOpened = () => {
    setOpened((prev) => !prev);
  };

  const classes = styles();

  const poStatusHeaderText = ["DRAFT", "PENDING"].includes(status)
    ? "common.pending"
    : "APPROVED";

  return (
    <List className={classes.list}>
      <ListItem className={classes.stateListItem} onClick={toggleOpened} >
        {opened ? <ListExpandIcon /> : <ListCollapseIcon /> }
        <ListItemText>
          <Box display="flex">
            <Box
              component="span"
              flexGrow={1}
              className={classNames(classes.itemHeader, {
                [classes.expandedItemHeader]: opened,
                [classes.collapsedItemHeader]: !opened,
              })}
            >
              <Text message={poStatusHeaderText} />
            </Box>
            <Box
              component="span"
              justifyContent="flex-end"
              className={classes.itemCount}
            >
              <Text
                translation="common.items.count"
                values={{
                  count: approvals.length,
                }}
              />
            </Box>
          </Box>
        </ListItemText>
      </ListItem>
      <Collapse in={opened} timeout="auto" unmountOnExit>
        { children }
      </Collapse>
    </List>
  );
};


export default ApprovalsBlock;
