import { get, map } from 'lodash';
import React from 'react';
import { FB, FBEditorValidationProps, FBSchemaProps, FBSchemaState } from '..';
import predefinedValidators from '../data/predefinedValidators.json';

export const withFBEditorValidation = <T extends FBEditorValidationProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    schemaState,
    schema,
    ...props
  }: T) => {
    schema = map(predefinedValidators as FBSchemaProps[], (schemaItem: FBSchemaProps) => ({
      ...schemaItem,
      onChange: (ev: React.ChangeEvent<any>) => onChange && onChange(ev, schemaItem),
    }));
    schemaState = FB.useRef<FBSchemaState>(FBSchemaState, schema);
    const { formState } = FB.useStores();

    const onChange = (ev: React.ChangeEvent<any>, schemaItem: FBSchemaProps) => {
      const value = get(ev.target, 'checked');
      const { name } = schemaItem;
      if (!value) {
        formState?.omitFieldValue(name + '.value');
        formState?.omitFieldValue(name + '.name');
        formState?.removeFieldRules(name + '.name');
      } else {
        const schemaSelectItemName = schemaState?.getSchemaItem(name + '.name');
        formState?.setFieldRules(name + '.name', schemaSelectItemName?.rules);
        formState?.setFieldFinalValidationRules(name + '.name', schemaSelectItemName?.rules);
      }
      formState?.getInputState(`${name}.name`)?.setHidden(!value);
      const schemaSelectItem = schemaState?.getSchemaItem(name + '.value');
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
