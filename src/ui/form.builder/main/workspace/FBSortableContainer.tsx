import { Box } from "@material-ui/core";
import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { withSortable } from "../../hocs/withSortable";
import { FBSortableProps } from "../../types/sortable";
import { FBTemplateSchema } from "../../types/store";

const FBSortableContainer: React.FunctionComponent<FBSortableProps> = ({
  items,
  wrapperRenderer,
  isSortable,
  ...props
}) => {
  const SortableItem = SortableElement(
    ({ value }: { value: FBTemplateSchema }) => (
      <li style={{ listStyleType: "none" }}>{wrapperRenderer(value)}</li>
    ),
  );

  const SortableList = SortableContainer(() => {
    return (
      <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </ul>
    );
  });

  const plainList = () => items.map((schema) => wrapperRenderer(schema));

  // We need isSortable workaround for our field triggers are not working
  // in sorting list. pressDelay & distance are not helping!
  return (
    <Box>
      {isSortable && (
        <SortableList {...props} axis="y" lockAxis="y" pressDelay={150} />
      )}
      {!isSortable && plainList()}
    </Box>
  );
};

export default withSortable(FBSortableContainer);
