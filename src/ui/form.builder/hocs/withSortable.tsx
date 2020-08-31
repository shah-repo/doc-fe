/* eslint-disable react/display-name */
import arrayMove from "array-move";
import { range } from "lodash";
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

    private isApproved = (schema: FBTemplateSchema): {disabled: boolean; approved: boolean} => {
      const { index = 0 } = schema;
      let state = { disabled: false, approved: false };
      const FBSchema = FBStore.getSchema();

      range(0, index).reverse().some((current) => {
        const schemaItem =  FBSchema[current];
        const { type, name } = schemaItem;
        if (type === "inlineapproval" || type === "approval") {
          const activeConfig = type === "approval" ? schemaItem : FBStore.getValue(name);
          const { approveIsBlocking = false } = activeConfig || {};
          let hasValue = type === "approval"
            ? FBStore.getValue(name)
            : FBStore.getValue(`${FBFieldName.RequestApproval}${name}`);
          hasValue = Boolean(hasValue);
          if (approveIsBlocking && !hasValue) {
            state = { disabled: true, approved: true };
          }
          return true;
        }
        return false;
      });
      return state;
    };

    private wrapperRenderer = (schema: FBTemplateSchema) => {
      const { type, reviseDisabled } = schema;
      const InputType = FBFieldComponent[type as string];
      let { disabled } = FBStore.fieldMode;

      // Approved state
      const state = this.isApproved(schema);
      state.disabled && (disabled = true);

      if (reviseDisabled && FBStore.isRevised) {
        disabled = true;
      }
      return <InputType key={schema.name} {...schema} {...{ disabled }} approved={state.approved} />;
    };

    private onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
      const newSchema = arrayMove(FBStore.getSchema(), oldIndex, newIndex);
      FBStore.setSchema(newSchema);
      sortableStore.setMode("inactive");
    };

    private onSortStart = () => sortableStore.setMode("active");

    private isSortable = (): boolean => FBStore.mode === "design";
  };
}
