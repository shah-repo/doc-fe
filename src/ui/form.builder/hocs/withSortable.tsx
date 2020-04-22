/* eslint-disable react/display-name */
import arrayMove from "array-move";
import _ from "lodash";
import React from "react";
import { SortEnd } from "react-sortable-hoc";
import { FBFieldName } from "..";
import { FBFieldComponent } from "../defaults/editor";
import sortableStore from "../stores/ui/FBSortableStore";
import FBStore from "../stores/ui/FBStore";
import { Subtract } from "../types/common";
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

    private isApproved = (schema: FBTemplateSchema): boolean => {
      const { index = 0 } = schema;
      let approved = true;

      _.range(index, _.size(FBStore.getSchema())).some((_item, current) => {
        const activeSchema = FBStore.getSchema()[current + index];
        const { type, name = "" } = activeSchema;
        const activeConfig = type === "approval" ? activeSchema : FBStore.getValue(name);
        const { approveIsBlocking = false } = activeConfig || {};
        if ((type === "inlineapproval" || type === "approval") && approveIsBlocking) {

          const hasValue = type === "approval"
            ? FBStore.getValue(name)
            : FBStore.getValue(`${FBFieldName.InlineApproval}${name}`);
          approved = Boolean(hasValue);
          return true;
        }
      });
      return approved;
    };

    private wrapperRenderer = (schema: FBTemplateSchema) => {
      const { type } = schema;
      const InputType = FBFieldComponent[type as string];

      let { disabled } = FBStore.fieldMode;

      // Approved state
      !this.isApproved(schema) && (disabled = true);
      return <InputType key={schema.name} {...schema} {...{ disabled }} />;
    };

    private onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
      const newSchema = arrayMove(FBStore.schema, oldIndex, newIndex);
      FBStore.setSchema(newSchema);
      sortableStore.setMode("inactive");
    };

    private onSortStart = () => sortableStore.setMode("active");

    private isSortable = (): boolean => FBStore.mode === "design";
  };
}
