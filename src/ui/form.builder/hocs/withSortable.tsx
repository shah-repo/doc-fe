import arrayMove from "array-move";
import React from "react";
import { SortEnd } from "react-sortable-hoc";
import FBEditorWrapper from "../components/custom/FBEditorWrapper";
import { FBFieldComponent } from "../defaults/editor";
import sortableStore from "../stores/FBSortableStore";
import formBuilderStore from "../stores/FBStore";
import { Subtract } from "../types/common";
import { FBSortableProps } from "../types/sortable";
import { FBTemplateSchema } from "../types/store";

export function withSortable<T extends FBSortableProps>(
  Component: React.ComponentType<T>
) {
  return class extends React.Component<
    Subtract<T, Omit<FBSortableProps, "items">>
  > {
    public render() {
      return (
        <Component
          {...(this.props as T)}
          wrapperRenderer={this.wrapperRenderer}
          onSortEnd={this.onSortEnd}
          onSortStart={this.onSortStart}
          isSortable={this.isSortable()}
        />
      );
    }
    private wrapperRenderer = (schema: FBTemplateSchema) => {
      const { type, name, index } = schema;
      const InputType = FBFieldComponent[type as string];

      return (
        <FBEditorWrapper key={`${name}_${index}`} {...schema}>
          <InputType {...schema} {...formBuilderStore.fieldMode} />
        </FBEditorWrapper>
      );
    };

    private onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
      const newSchema = arrayMove(formBuilderStore.schema, oldIndex, newIndex);
      formBuilderStore.setSchema(newSchema);
      sortableStore.setMode("inactive");
    };

    private onSortStart = () => sortableStore.setMode("active");

    private isSortable = (): boolean => formBuilderStore.mode !== "form";
  };
}
