import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBSchemaComponentProps, FBSchemaProps, FBSchemaState } from ".";
import { FB, FBFieldName, FBSortable } from "..";

export const withFBSchema = <T extends FBSchemaComponentProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    workspaceMode,
    schemaState,
    schema,
    ...props
  }: T) => {

    !schemaState && (schemaState = FB.useRef<FBSchemaState>(FBSchemaState, schema));
    const { workspaceState } = FB.useStores();

    function controlRenderer(schemaItem: FBSchemaProps): React.ReactNode | undefined {
      return FBSchemaState.component(schemaItem);
    }

    function isApproved(schemaItem: FBSchemaProps): boolean {
      const { index = 0 } = schemaItem;
      const { formState } = FB.useStores();
      let disabled = false;

      _.range(0, index).reverse().some((current) => {
        if (!schema) { return disabled; }
        const item =  schema[current];
        const { type, name } = item;
        if (type === "requestapproval" || type === "approval") {
          const activeConfig = type === "approval" ? item : formState?.getFieldValue(name);
          const { approveIsBlocking = false } = activeConfig || {};
          let hasValue = type === "approval"
            ? formState?.getFieldValue(name)
            : formState?.getFieldValue(`${FBFieldName.RequestApproval}${name}`);
          hasValue = Boolean(hasValue);
          if (approveIsBlocking && !hasValue) {
            disabled = true;
          }
          return true;
        }
        return false;
      });
      return disabled;
    }

    function schemaRenderer(): React.ReactNode | React.ReactNode[] | undefined {
      if (workspaceMode === "design") {
        return <FBSortable />;
      }
      return _.map(schema, (schemaItem, index) => controlRenderer({
        ...schemaItem,
        disabled: (
          schemaItem.disabled ||
          workspaceMode === "preview" ||
          isApproved(schemaItem) ||
          (schemaItem.reviseDisabled && workspaceState?.document?.outputRevision)
        ),
        index,
      }));
    }

    useObserver(() => {
      schema = schemaState?.schema;
    });

    return Component({
      ...(props as T),
      schemaState,
      workspaceMode,
      schema,
      children: schemaRenderer(),
    });
  };

  return (props: T) => Comp(props);
};
