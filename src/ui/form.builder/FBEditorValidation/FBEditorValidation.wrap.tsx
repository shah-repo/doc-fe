import _ from "lodash";
import React from "react";
import { FB, FBEditorValidationProps, FBSchemaProps, FBSchemaState } from "..";
import predefinedValidators from "../data/predefinedValidators.json";
// import { getHasPermission } from "../../../common/utils/selectors";

export const withFBEditorValidation = <T extends FBEditorValidationProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    schemaState,
    schema,
    ...props
  }: T) => {

    // const enableCustomValidator = useSelector(
    //   getHasPermission(Permission.FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED)
    // );
    schema = _.map(predefinedValidators as FBSchemaProps[], (schemaItem: FBSchemaProps) => ({
      ...schemaItem,
      onChange: (ev: React.ChangeEvent<any>) => onChange && onChange(ev, schemaItem),
    }));
    schemaState = FB.useRef<FBSchemaState>(FBSchemaState, schema);
    const { formState } = FB.useStores();

    const onChange = (ev: React.ChangeEvent<any>, schemaItem: FBSchemaProps) => {
      const value = _.get(ev.target, "checked");
      const { name } = schemaItem;
      if (!value) {
        formState?.setFieldValue(name + ".value", undefined);
        formState?.setFieldValue(name + ".name", undefined, true);
      }
      const schemaSelectItem = schemaState?.getSchemaItem(name + ".value");
      schemaSelectItem && schemaState && (schemaState.removeSchemaItem(schemaSelectItem));
    };

    return Component({
      ...(props as T),
      initialValues: formState?.initialValues,
      schemaState,
      schema,
    });
  };

  return (props: T) => Comp(props);
};
