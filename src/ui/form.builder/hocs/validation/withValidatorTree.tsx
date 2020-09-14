import { Tooltip } from "@material-ui/core";
import TreeItem from "@material-ui/lab/TreeItem";
import { includes, isUndefined, kebabCase, map, size, split, truncate as lodashTruncate } from "lodash";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FB, FBInputProps } from "../..";
import FBCheckbox from "../../components/inputs/FBCheckbox";
import { FBEditorSectionConfig } from "../../defaults/editor";
import { FBValidatorTreeProps } from "../../types/validation/validatorTree";
import { withFBStores } from "../common/withFBStores";

export const withValidatorTree = <T extends FBValidatorTreeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({ expanded, dynamicValidatorStore, ...props }: T) => {
    const truncateValue = 44;
    let state: Pick<FBValidatorTreeProps, "expanded"> = {};

    React.useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      state = observable({
        expanded: [],
      });
    }, []);

    const { workspaceState } = FB.useStores();

    const truncate = (value = ""): string =>
      lodashTruncate(value, {
        length: truncateValue,
        omission: " [...]",
      });

    const onNodeToggle = (event: React.ChangeEvent<{}>, nodes: string[]) => {
      state.expanded = nodes;
    };

    const afterChange = (fieldName: string, value: boolean) => {
      if (isUndefined(value) || !value) {
        return dynamicValidatorStore?.removeVariable(fieldName);
      }
      dynamicValidatorStore?.setVariable(fieldName);
    };

    const optionsNode = (options: string[], name: string, type: string) => {
      const isValueVar = type === "radiogroup" || type === "select";
      const valueVar = isValueVar ? "-<-val->" : "";

      return map(options, (option) => {
        const optionName = `${kebabCase(option)}${valueVar}-${name}`;
        const tooltip = size(option) >= truncateValue ? option : "";
        const key = `tree-node-${name}-${option}`;
        const label = truncate(option);

        return (
          <FBCheckbox
            gutter={false}
            name={optionName}
            {...{ key, tooltip, label, afterChange }}
          />
        );
      });
    };

    const contextNode = (
      name: string,
      label: string | React.ReactNode,
      included = false,
    ) => {
      const contextLabel = truncate(label as string);
      const tooltip =
        size(contextLabel) >= truncateValue ? (label as string) : "";
      // Workaround for mui treeview bug where it registers the child but do not render it
      if (!included) {
        return <div />;
      }
      return (
        <FBCheckbox
          gutter={false}
          name={`input-context-${name}`}
          label={contextLabel}
          {...{ tooltip, afterChange }}
        />
      );
    };

    const labelNode = (name: string, label: string | React.ReactNode) => {
      const nodeLabel = truncate(label as string);
      const tooltip =
        size(nodeLabel) >= truncateValue ? (label as string) : "";
      return (
        <FBCheckbox
          label={nodeLabel}
          gutter={false}
          {...{ name, tooltip, afterChange }}
        />
      );
    };

    const regularNode = (name: string, label: string | React.ReactNode) => {
      const regularLabel = truncate(label as string);
      const tooltip =
        size(regularLabel) >= truncateValue ? (label as string) : "";
      return (
        <FBCheckbox
          key={`tree-node-${name}`}
          label={regularLabel}
          gutter={false}
          {...{ name, tooltip, afterChange }}
        />
      );
    };

    const parentNode = (
      schemaItem: FBInputProps,
      includeNodeField = false,
    ) => {
      const { name, includeContext, type, label } = schemaItem;
      let { options } = schemaItem;
      const isOther = type === "select" || includes(type, "group");
      const contextLabel = isOther ? "form.builder.other" : "form.builder.note";
      let treeLabel: string | React.ReactNode = truncate(label as string);
      const tooltip =
        size(treeLabel) >= truncateValue ? (label as string) : "";

      !isUndefined(options) &&
        (options = split((schemaItem.options || "") as string, "\n"));
      includeNodeField && (treeLabel = labelNode(name || "", label));

      return (
        <Tooltip title={tooltip} placement="bottom-start">
          <TreeItem nodeId={`tree-node-${name}`} label={treeLabel}>
            {optionsNode(options || [], name || "", type as string)}
            {contextNode(name || "", contextLabel, includeContext)}
          </TreeItem>
        </Tooltip>
      );
    };

    const items = map(workspaceState?.getSchema(), (schemaItem) => {
      const { name, label, type } = schemaItem;
      if (includes(FBEditorSectionConfig.section, type)) {
        return <div />;
      }
      switch (type) {
        case "checkboxgroup":
          return parentNode(schemaItem, false);
        case "radiogroup":
        case "checkbox":
        case "radio":
        case "select":
          return parentNode(schemaItem, true);
        default:
          return regularNode(name || "", label);
      }
    });

    return Component({
      ...(props as T),
      ...state,
      onNodeToggle,
      items,
    });
  };

  return observer(withFBStores((props: T) => Comp(props)));
};
