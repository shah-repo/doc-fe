import { map } from "lodash";
import { Observer, useObserver } from "mobx-react";
import React from "react";
import { arrayMove, SortableElement, SortEnd, SortStart } from "react-sortable-hoc";
import { FB, FBFieldWrapper, FBInputProps, FBSchemaProps, FBSchemaState, FBSortableProps, FBSortableState } from "..";
import SM from "../../../App/Shifamed/Utils/SM/SM";

export const withFBSortable = <T extends FBSortableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();
    const { _tabsState } = SM.useStores();

    const sortableState = FB.useRef<FBSortableState>(FBSortableState);

    const schemaField = (schemaItem: FBSchemaProps): React.ReactNode | undefined => {
      const isUnderWorkspace = workspaceState?.getSchemaItem(schemaItem.name);
      return FBSchemaState.component({
        ...schemaItem,
        autosave: isUnderWorkspace && workspaceState?.autosave,
        disabled: workspaceState?.isMode("design"),
        showErrorMsg: !workspaceState?.isMode("design"),
        gutter: false,
      });
    };

    const isHiddenByRules = (item: FBSchemaProps) => workspaceState?.hiddenFieldsByRules?.has(item.name as string);

    const SortableItem = SortableElement(({ value, position }: { value: FBSchemaProps; position: number }) => (
      <Observer>
        {() => (
          <li style={{ listStyleType: "none", display: isHiddenByRules(value) ? "none" : "block" }}>
            <FBFieldWrapper
              key={`fb-sortable-wrapper-${value.index}`}
              inputProps={value as FBInputProps}
              position={position}
            >
              {schemaField(value)}
            </FBFieldWrapper>
          </li>
        )}
      </Observer>
    ));

    let position = 0;
    const items = useObserver(() => map(workspaceState?.getSchema(), (schemaItem, index: number) => {
      if (schemaItem.deleted || schemaItem.hidden ||
        (_tabsState && schemaItem.tabId && schemaItem.tabId !==  _tabsState?.activeTabId)) { return; }
      position++;
      return (
        <SortableItem
          key={`fb-sortable-item-${index}`}
          value={{ ...schemaItem, index }}
          {...{ index, position }}
        />
      );
    }));

    const onSortStart = ({ index }: SortStart) => {
      sortableState.setDraggedIndex(index);
    };

    const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
      sortableState.setDraggedIndex(null);

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
      sortableState,
      onSortEnd,
      onSortStart,
      shouldCancelStart,
    });
  };

  return (props: T) => Comp(props);
};
