import { Box } from "@material-ui/core";
import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { FBFieldWrapper } from "../..";
import { withSortable } from "../../hocs/withSortable";
import { FBSortableProps } from "../../types/sortable";
import { FBTemplateSchema } from "../../types/store";

const SortableItem = SortableElement(
  ({ value, wrapperRenderer }: { value: FBTemplateSchema; wrapperRenderer: any }) => (
    <li style={{ listStyleType: "none" }} id="FBSortableContainer-list" >
      <FBFieldWrapper
        key={`${value.name}_${value.index}`}
        index={value.index}
        designDisabled={value.designDisabled}
        reviseDisabled={value.reviseDisabled}
      >
        {wrapperRenderer(value)}
      </FBFieldWrapper>
    </li>
  ),
);

const SortableList = SortableContainer(({ items, wrapperRenderer }) => (
  <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} wrapperRenderer={wrapperRenderer} />
    ))}
  </ul>
));

const FBSortableContainer: React.FunctionComponent<FBSortableProps> = ({
  items,
  wrapperRenderer,
  isSortable,
  ...props
}) => {

  const plainList = () => items.map((schema) => wrapperRenderer(schema));

  // We need isSortable workaround for our field triggers are not working
  // in sorting list. pressDelay & distance are not helping!
  return (
    <Box>
      {isSortable && (
        <SortableList
          {...props}
          items={items}
          wrapperRenderer={wrapperRenderer}
          axis="y"
          lockAxis="y"
          pressDelay={150}
        />
      )}
      {!isSortable && plainList()}
    </Box>
  );
};

export default withSortable(FBSortableContainer);
