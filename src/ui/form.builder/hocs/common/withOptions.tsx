import { isString, kebabCase, map, split, union } from 'lodash';
import React from 'react';
import { FBOptionProps } from '../../types/common';
import { withFormik } from './withFormik';

export const withOptions = <T extends FBOptionProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    includeNone = false,
    optionLabelKey = 'text',
    optionValueKey = 'value',
    includeContext,
    name,
    type,
    ...props
  }: T) => {
    function mapStringOption (): string | NonNullable<T['options']> {
      const splitArray = split(props.options as string, '\n');
      const isValueVar = type === 'radiogroup' || type === 'select';
      const valueVar = isValueVar ? '-<-val->' : '';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return map(splitArray, (option) => ({
        [optionValueKey]: `${kebabCase(option)}${valueVar}-${name}`,
        [optionLabelKey]: option,
      }));
    }

    function unionNoneOption (options: any[]): string | NonNullable<T['options']> {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return union([{
        [optionValueKey]: '',
        [optionLabelKey]: 'fields.select.none',
      }], options);
    }

    function unionContextOption (options: any[]): string | NonNullable<T['options']> {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return union(options, [{
        [optionValueKey]: `context-${name}`,
        [optionLabelKey]: 'form.builder.other',
      }]);
    }

    const optionsSet = (): T['options'] => {
      let options = props.options || '';
      isString(options) && (options = mapStringOption());
      includeNone && (options = unionNoneOption(options as any[]));
      includeContext && (options = unionContextOption(options as any[]));
      return options;
    };

    return Component({
      ...props as T,
      options: optionsSet(),
      includeNone,
      optionLabelKey,
      optionValueKey,
      includeContext,
      name,
      type,
    });
  };

  return withFormik((props: T) => Comp(props));
};
