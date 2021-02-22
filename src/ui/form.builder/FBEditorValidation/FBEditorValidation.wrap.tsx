import { get, includes, isEmpty, map } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { FB, FBButton, FBDialogState, FBEditorValidationProps, FBSchemaProps, FBSchemaState } from "..";
import { getHasPermission } from "../../../common/utils/selectors";
import { Permission } from "../../../state/ducks/auth";
import FBValidatorCustom from "../components/validation/FBValidatorCustom";
import predefinedValidators from "../data/predefinedValidators.json";
import FBDynamicValidatorStore from "../stores/ui/FBDynamicValidatorStore";

export const withFBEditorValidation = <T extends FBEditorValidationProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    handleCustomValidation,
    schemaState,
    dialogState,
    customValidationEnabled,
    schema,
    ...props
  }: T) => {

    customValidationEnabled = useSelector(
      getHasPermission(Permission.FORM_BUILDER_CUSTOM_VALIDATORS_ENABLED),
    );

    schema = map(predefinedValidators as FBSchemaProps[], (schemaItem: FBSchemaProps) => ({
      ...schemaItem,
      onChange: (ev: React.ChangeEvent<any>) => onChange && onChange(ev, schemaItem),
    }));
    schemaState = FB.useRef<FBSchemaState>(FBSchemaState, schema);
    dialogState = FB.useRef<FBDialogState>(FBDialogState);
    const { formState } = FB.useStores();

    const onChange = (ev: React.ChangeEvent<any>, schemaItem: FBSchemaProps) => {
      const value = get(ev.target, "checked");
      const { name } = schemaItem;
      if (!value) {
        formState?.omitFieldValue(name + ".value");
        formState?.omitFieldValue(name + ".name");
      }
      formState?.getInputState(`${name}.name`)?.setHidden(!value);
      const schemaSelectItem = schemaState?.getSchemaItem(name + ".value");
      schemaSelectItem && schemaState && (schemaState.removeSchemaItem(schemaSelectItem));
    };

    const commitCustomValidation = () => {
      const customValidator = FBDynamicValidatorStore.dynamicValidator;
      formState?.setFieldValue("customValidator", customValidator);
      let rules = formState?.getFieldValue("rules") || "";
      const customValidatorRule = customValidator && customValidator.name;
      if (customValidatorRule && !includes(rules, customValidatorRule)) {
        rules += `${!isEmpty(rules) ? "|" : ""}${customValidatorRule}`;
      }
      formState?.setFieldValue("rules", rules);
      dialogState?.closeDialog();
    };

    handleCustomValidation = () => dialogState?.config({
      open: true,
      maxWidth: "xl",
      content: <FBValidatorCustom/>,
      actions: (
        <>
          <FBButton label="Commit" onClick={commitCustomValidation} />
        </>
      ),
    });

    return Component({
      ...(props as T),
      handleCustomValidation,
      initialValues: formState?.initialValues,
      customValidationEnabled,
      schemaState,
      dialogState,
      schema,
    });
  };

  return (props: T) => Comp(props);
};
