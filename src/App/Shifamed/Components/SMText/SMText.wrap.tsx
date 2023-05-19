import { map } from 'lodash';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { SMTextLocaleProps, SMTextProps } from './SMText.types';

export const withSMText = <T extends SMTextProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    label,
    ...props
  }: T) => {
    const intl = useIntl();

    useMemo(
      () => {
        const intlValues = (label as SMTextLocaleProps).values;
        map(intlValues, (value, key) => intlValues[key] = intl.formatMessage({ id: value }));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    return  Component({
      ...(props as T),
      label,
    });
  };
  Comp.displayName = 'withFBNotes';
  return Comp;
};
