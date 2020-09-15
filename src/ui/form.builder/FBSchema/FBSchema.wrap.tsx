import { isEmpty, map, range } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBFieldName, FBInputProps, FBSchemaComponentProps, FBSchemaProps, FBSchemaState, FBSortable } from "..";
import FormBuilderDynamicValidatorStore from "../stores/ui/FBDynamicValidatorStore";

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
    const { workspaceState, formState } = FB.useStores();
    const { isOutput, id, document: { outputRevision = false } = {} } = workspaceState || {};

    React.useEffect(() => {
      FormBuilderDynamicValidatorStore.registerValidators(schema, formState?.Validator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function controlRenderer(schemaItem: FBSchemaProps | FBInputProps): React.ReactNode | undefined {
      return FBSchemaState.component(schemaItem);
    }

    function isApproved(schemaItem: FBSchemaProps): boolean {
      const { index = 0 } = schemaItem;
      const { formState } = FB.useStores();
      let disabled = false;

      range(0, index).reverse().some((current) => {
        if (!schema) { return disabled; }
        const item =  schema[current];
        const { type, name } = item;
        if (type === "requestapproval" || type === "inlineapproval") {
          const activeConfig = type === "inlineapproval" ? item : formState?.getFieldValue(name);
          const { approveIsBlocking = false } = activeConfig || {};
          let hasValue = type === "inlineapproval"
            ? formState?.getFieldValue(name)
            : formState?.getFieldValue(FBFieldName.RequestApproval + name);
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
      return map(schema, (schemaItem, index) => {
        const isUnderWorkspace = workspaceState?.getSchemaItem(schemaItem.name);
        const { disabled, reviseDisabled, outputDisabled } = schemaItem || {};
        return controlRenderer({
          autosave: isUnderWorkspace && workspaceState?.autosave,
          ...schemaItem,
          disabled: (
            disabled ||
            workspaceMode === "preview" ||
            workspaceMode === "formPreview" ||
            isApproved({ ...schemaItem, index }) ||
            (reviseDisabled && outputRevision) ||
            (outputDisabled && isOutput && !isEmpty(id))
          ),
          index,
        });
      });
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
