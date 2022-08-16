import React from "react";
import { SortableContainer } from "react-sortable-hoc";
import { FBSortableProps } from "..";
import { withFBSortable } from "./FBSortable.wrap";

const FBSortable: React.FunctionComponent<FBSortableProps> = ({
  items,
  ...props
}) => {
  const SortableList = SortableContainer(() => (
    <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
      {items}
    </ul>
  ));
  // eslint-disable-next-line max-len
  return <SortableList {...props} axis="y" lockAxis="y" pressDelay={200} lockToContainerEdges={true} lockOffset={["5%", "100%"]} />;
};

export default withFBSortable(FBSortable);
