/* eslint-disable react/display-name */
import arrayMove from "array-move";
import _ from "lodash";
import React from "react";
import { SortEnd } from "react-sortable-hoc";
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
    private isApproved = true;
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

    private approvedState = (schema: FBTemplateSchema) => {
      const { type, name = "", approveIsBlocking } = schema;
      if (type !== "inlineapproval" && type !== "approval") {
        return;
      }
      console.log(schema);
      console.log(FBStore.getValue(name));
      if (approveIsBlocking && !FBStore.getValue(name)) {
        this.isApproved = false;
      }
      if (_.last(FBStore.getSchema())?.name === name) {
        this.isApproved = true;
      }
      // const { approvers, approverGroups, approveIsBlocking } = FBStore.getValue(name) || schema;
      // const formValue = FBStore.getValue(`fb-approval-field-${name}`);
      // if ((!_.isEmpty(approvers) || !_.isEmpty(approverGroups)) && approveIsBlocking && _.isEmpty(formValue)) {
      //   this.isApproved = false;
      // }
    };

    private wrapperRenderer = (schema: FBTemplateSchema) => {
      const { type } = schema;
      const InputType = FBFieldComponent[type as string];

      let { disabled } = FBStore.fieldMode;

      // Approved state
      this.approvedState(schema);
      !this.isApproved && (disabled = true);
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
