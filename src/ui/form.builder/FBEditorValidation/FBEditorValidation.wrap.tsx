import _ from "lodash";
import React from "react";
import { FBEditorValidationProps } from ".";
import { FB } from "..";
import predefinedValidators from "../data/predefinedValidators.json";
import { FBSchemaProps, FBSchemaState } from "../FBSchema";
// import { getHasPermission } from "../../../common/utils/selectors";

export const withFBEditorValidation = <T extends FBEditorValidationProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    onChange,
    schema,
    ...props
  }: T) => {

    // const enableCustomValidator = useSelector(
    //   getHasPermission(Permission.FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED)
    // );
    const { formState } = FB.useStores();

    onChange = (checked: boolean, schemaItem: FBSchemaProps, schemaState) => {
      const { name } = schemaItem;
      if (!checked) {
        formState?.setFieldValue(`${name}.name`, undefined, true);
        const schemaSelectItem = schemaState?.getSchemaItem(`${name}.value`);
        schemaSelectItem && schemaState && (schemaState.removeSchemaItem(schemaSelectItem));
      }
    };

    schema = _.map(predefinedValidators as FBSchemaProps[], (schemaItem: FBSchemaProps) => ({
      ...schemaItem,
      onChange: (_ev: any, value: boolean, schemaState: FBSchemaState) =>
        onChange && onChange(value, schemaItem, schemaState),
    }));

    return Component({
      ...(props as T),
      initialValues: formState?.initialValues,
      schema,
    });
  };

  return (props: T) => Comp(props);
};
