import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import React from "react";
import { withValidatorTree } from "../../hocs/validation/withValidatorTree";
import { FBValidatorTreeProps } from "../../types/validation/validatorTree";

const FBValidatorTree: React.FunctionComponent<FBValidatorTreeProps> = ({
  expanded,
  onNodeToggle,
  items,
}) => (
  <TreeView
    defaultExpanded={["1"]}
    defaultCollapseIcon={<ExpandMoreIcon />}
    defaultExpandIcon={<ChevronRightIcon />}
    {...{ expanded, onNodeToggle }}
  >
    <TreeItem nodeId="1" label="Form Fields">
      {items}
    </TreeItem>
  </TreeView>
);

export default withValidatorTree(FBValidatorTree);
