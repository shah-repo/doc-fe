import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { arrayMove, SortableElement, SortEnd } from "react-sortable-hoc";
import { FBSortableProps } from ".";
import { FB, FBFieldWrapper, FBSchemaProps, FBSchemaState } from "..";

export const withFBSortable = <T extends FBSortableProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    ...props
  }: T) => {

    const { workspaceState } = FB.useStores();

    const schemaField = (schemaItem: FBSchemaProps): React.ReactNode | undefined =>
      FBSchemaState.component({
        ...schemaItem,
        disabled: true,
        gutter: false,
      });

    const SortableItem = SortableElement(({ value }: { value: FBSchemaProps }) => (
      <li style={{ listStyleType: "none" }}>
        <FBFieldWrapper
          key={`fb-sortable-wrapper-${value.index}`}
          index={value.index}
        >
          {schemaField(value)}
        </FBFieldWrapper>
      </li>
    ));

    const items = useObserver(() => _.map(workspaceState?.getSchema(), (schemaItem, index: number) => (
      <SortableItem
        key={`fb-sortable-item-${index}`}
        value={{ ...schemaItem, index }}
        {...{ index }}
      />
    )));

    const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
      const schema = workspaceState?.schema;
      if (!schema) {
        return;
      }
      const newSchema: FBSchemaProps[] = arrayMove(schema, oldIndex, newIndex);
      workspaceState?.setSchema(newSchema);
    };

    return Component({
      ...(props),
      items,
      onSortEnd,
    });
  };

  return (props: T) => Comp(props);
};
