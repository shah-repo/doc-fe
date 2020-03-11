import arrayMove from "array-move";
import _ from "lodash";
import React from "react";
import { SortEnd } from "react-sortable-hoc";
import { FBFieldComponent } from "../defaults/editor";
import sortableStore from "../stores/ui/FBSortableStore";
import FBStore from "../stores/ui/FBStore";
import { FBInputProps, Subtract } from "../types/common";
import { FBSortableProps } from "../types/sortable";
import { FBTemplateSchema } from "../types/store";

export function withSortable<T extends FBSortableProps>(
  Component: React.ComponentType<T>,
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
      const InputType = FBFieldComponent[schema.type as string];
      return <InputType key={schema.name} {...schema} {...FBStore.fieldMode} />;
    };

    private onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
      const newSchema = arrayMove(FBStore.schema, oldIndex, newIndex);
      let sectionNumbering = 1;
      _.map(newSchema, (schemaItem: FBInputProps) => {
        if (schemaItem.type !== "sectionnumbering") {
          return;
        }
        const slicedLabel = (_.get(schemaItem, "label", "")! as string).slice(0, -1);
        schemaItem.label = `${slicedLabel} ${sectionNumbering}`;
        sectionNumbering++;
      });
      FBStore.setSchema(newSchema);
      sortableStore.setMode("inactive");
    };

    private onSortStart = () => sortableStore.setMode("active");

    private isSortable = (): boolean => FBStore.mode === "design";
  };
}
