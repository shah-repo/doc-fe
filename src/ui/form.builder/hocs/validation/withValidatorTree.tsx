import TreeItem from "@material-ui/lab/TreeItem";
import _ from "lodash";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import FBCheckbox from "../../components/inputs/FBCheckbox";
import FBStore from "../../stores/ui/FBStore";
import { FBInputProps } from "../../types/common";
import { FBValidatorTreeProps } from "../../types/validation/validatorTree";
import { withFBStores } from "../common/withFBStores";

export const withValidatorTree = <T extends FBValidatorTreeProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    expanded,
    dynamicValidatorStore,
    ...props
  }: T) => {

    let state: Pick<FBValidatorTreeProps, "expanded"> = {};

    React.useEffect(() => {
      state = observable({
        expanded: [],
      });
    }, []);

    const onNodeToggle = (event: React.ChangeEvent<{}>, nodes: string[]) => {
      state.expanded = nodes;
    };

    const afterChange = (fieldName: string, value: boolean) => {
      if (_.isUndefined(value) || !value) {
          return dynamicValidatorStore!.removeVariable(fieldName);
      }
      dynamicValidatorStore!.setVariable(fieldName);
    };

    const optionsNode = (options: string[], name: string) =>
      _.map(options, (option) => (
        <FBCheckbox
          key={`tree-node-${name}-${option}`}
          gutter={false}
          name={`${_.kebabCase(option)}-${name}`}
          label={option}
          {...{ afterChange }}
        />
      ));

    const contextNode = (name: string, label: string | React.ReactNode) => (
      <FBCheckbox
        gutter={false}
        name={`context-${name}`}
        {...{ label, afterChange }}
      />
    );

    const labelNode = (name: string, label: string | React.ReactNode) => (
      <FBCheckbox
        gutter={false}
        name={name}
        {...{ label, afterChange }}
      />
    );

    const regularNode = (name: string, label: string | React.ReactNode) => (
      <FBCheckbox
        key={`tree-node-${name}`}
        gutter={false}
        {...{name, label, afterChange}}
      />
    );

    const parentNode = (schemaItem: FBInputProps, includeNodeField: boolean = false) => {
      const { name, includeContext, type } = schemaItem;
      let { label, options } = schemaItem;
      const isOther = type === "select" || _.includes(type, "group");
      const contextLabel = isOther ? "form.builder.other" : "form.builder.note";

      !_.isUndefined(options) && (options = (
        _.split((schemaItem.options || "") as string, "\n")
      ));
      includeNodeField && (label = labelNode(name!, label));

      return (
        <TreeItem nodeId={`tree-node-${name!}`} {...{ label }}>
          {optionsNode(options || [], name!)}
          {includeContext && contextNode(name!, contextLabel)}
        </TreeItem>
      );
    };

    const items = _.map(FBStore.getSchema(), (schemaItem) => {
        const { name, label } = schemaItem;
        switch (schemaItem.type) {
          case "checkboxgroup":
            return parentNode(schemaItem, false);
          case "radiogroup":
          case "checkbox":
          case "radio":
          case "select":
            return parentNode(schemaItem, true);
          default:
            return regularNode(name!, label);
        }
    });

    return Component({
      ...(props as T),
      ...state,
      onNodeToggle,
      items,
    });
  };

  return (
    observer(
    withFBStores(
      (props: T) => Comp(props),
    ))
  );
};
