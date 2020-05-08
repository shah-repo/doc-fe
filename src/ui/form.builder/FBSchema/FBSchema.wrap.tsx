import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBSchemaComponentProps, FBSchemaProps, FBSchemaState } from ".";
import { FB, FBSortable } from "..";

export const withFBSchema = <T extends FBSchemaComponentProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    workspaceMode,
    schemaState,
    schema,
    ...props
  }: T) => {

    schemaState = FB.useRef<FBSchemaState>(FBSchemaState, schema);

    function controlRenderer(schemaItem: FBSchemaProps): React.ReactNode | undefined {
      return FBSchemaState.component(schemaItem);
    }

    function schemaRenderer(): React.ReactNode | React.ReactNode[] | undefined {
      if (workspaceMode === "design") {
        return <FBSortable />;
      }
      return _.map(schema, (schemaItem, index) => controlRenderer({
        ...schemaItem,
        disabled: schemaItem.disabled || schemaItem.reviseDisabled || workspaceMode === "preview",
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
