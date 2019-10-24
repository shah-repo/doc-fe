import arrayMove from "array-move";
import React from "react";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import FBEditorWrapper from "../../components/custom/FBEditorWrapper";
import { FBFieldComponent } from "../../defaults/editor";
import sortableStore from "../../stores/FBSortableStore";
import formBuilderStore from "../../stores/FBStore";
import { FBSortableProps } from "../../types/sortable";
import { FBTemplateSchema } from "../../types/store";

const SortableItem = SortableElement(({value}: {value: FBTemplateSchema}) => {
  const { type, name, index } = value;
  const InputType = FBFieldComponent[type as string];

  return (
    <li style={{ listStyleType: "none" }}>
      <FBEditorWrapper key={`${name}_${index}`} index={index} {...value} >
        <InputType {...value} {...formBuilderStore.fieldMode} />
      </FBEditorWrapper>
    </li>
  );
});

const SortableList = SortableContainer(({items}: FBSortableProps) => {
  return (
    <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

const FBSortableContainer: React.FunctionComponent<FBSortableProps> = ({
  items,
}) => {
  const onSortEnd = ({oldIndex, newIndex}: {oldIndex: number, newIndex: number}) => {
    const schema = arrayMove(formBuilderStore.schema, oldIndex, newIndex);
    schema.map((item, i) => { item.index = i; });
    formBuilderStore.setSchema(schema);
    sortableStore.setMode("inactive");
  };

  const onSortStart = () => {
    sortableStore.setMode("active");
  };

  if (formBuilderStore.mode === "form") {

    const t = items.map((value, index) => {
      const { type, name } = value;
      const InputType = FBFieldComponent[type as string];

      return (
        <FBEditorWrapper key={`${name}_${index}`} index={index} {...value} >
          <InputType {...value} {...formBuilderStore.fieldMode} />
        </FBEditorWrapper>
      );
    });

    return (<span>{t}</span>);
  }

  return (
    <SortableList items={items} onSortStart={onSortStart} onSortEnd={onSortEnd} />
  );
};

export default FBSortableContainer;
