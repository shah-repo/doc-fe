import { map } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { arrayMove, SortableElement, SortEnd } from "react-sortable-hoc";
import { FBSortableProps } from ".";
import { FB, FBFieldWrapper, FBInputProps, FBSchemaProps, FBSchemaState } from "..";

export const withFBSortable = <T extends FBSortableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();

    const schemaField = (schemaItem: FBSchemaProps): React.ReactNode | undefined => {
      const isUnderWorkspace = workspaceState?.getSchemaItem(schemaItem.name);
      return FBSchemaState.component({
        ...schemaItem,
        autosave: isUnderWorkspace && workspaceState?.autosave,
        disabled: workspaceState?.isMode("design"),
        gutter: false,
      });
    };

    const SortableItem = SortableElement(({ value }: { value: FBSchemaProps }) => (
      <li style={{ listStyleType: "none" }}>
        <FBFieldWrapper
          key={`fb-sortable-wrapper-${value.index}`}
          inputProps={value as FBInputProps}
        >
          {schemaField(value)}
        </FBFieldWrapper>
      </li>
    ));

    const items = useObserver(() => map(workspaceState?.getSchema(), (schemaItem, index: number) => {
      if (schemaItem.deleted) { return; }
      return (
        <SortableItem
          key={`fb-sortable-item-${index}`}
          value={{ ...schemaItem, index }}
          {...{ index }}
        />
      );
    }));

    const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
      const schema = workspaceState?.schema;
      if (!schema) {
        return;
      }
      const newSchema: FBSchemaProps[] = arrayMove(schema, oldIndex, newIndex);
      workspaceState?.setSchema(newSchema);
    };

    const shouldCancelStart = (e: { buttons: number; ctrlKey: boolean; button: number; target: HTMLElement }) => {
      // Limit sort to a sort icon click
      if (workspaceState?.mode === "formDesign" && e.target.nodeName !== "svg") {
        return true;
      }
      return (
        (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
        (e.buttons === 2 && e.button === 2)
      );
    };


    return Component({
      ...(props),
      items,
      onSortEnd,
      shouldCancelStart,
    });
  };

  return (props: T) => Comp(props);
};
