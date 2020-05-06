/* eslint-disable react/display-name */
import arrayMove from "array-move";
import _ from "lodash";
import React from "react";
import { SortEnd } from "react-sortable-hoc";
import { FBFieldName } from "..";
import { FBFieldComponent } from "../defaults/editor";
import { FBInputType } from "../FBInput";
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

    private pickApprovalStart: FBInputType[] = [
      "approval",
      "inlineapproval",
      "section",
      "stepsection",
      "teststep",
    ];

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
      const state = { disabled: false, approved: false };
      const FBSchema = FBStore.getSchema();
      let approvalField: FBInputProps | undefined;
      let rangeEnd = 0;
      let rangeStart = 0;

      _.range(index, _.size(FBSchema)).some((current) => {
        const schemaItem =  FBSchema[current];
        const { type } = schemaItem;
        if (type === "inlineapproval" || type === "approval") {
          approvalField = schemaItem;
          rangeEnd = current;
          return true;
        }
        return false;
      });

      if (!approvalField) { return state; }

      _.range(0, rangeEnd).reverse().some((current) => {
        const schemaItem =  FBSchema[current];
        const { type } = schemaItem;
        const { type: approvalType, name: approvalName } = approvalField || {};
        if (_.includes(this.pickApprovalStart, type) || current === 0) {
          const activeConfig = approvalType === "approval" ? approvalField : FBStore.getValue(approvalName);
          const { approveIsBlocking = false } = activeConfig || {};
          let hasValue = approvalType === "approval"
            ? FBStore.getValue(approvalName)
            : FBStore.getValue(`${FBFieldName.InlineApproval}${approvalName}`);
          hasValue = Boolean(hasValue);
          rangeStart = (approveIsBlocking && hasValue) ? current : rangeEnd;
          return true;
        }
        return false;
      });

      if (_.inRange(index, rangeStart, rangeEnd)) {
        return { disabled: true, approved: true };
      }
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
