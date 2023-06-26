import React from 'react';
import { Props as TranslationProps } from 'react-intl/lib/components/message';
import Text from '../../Text';

export function renderNode(node: React.ReactNode, values?: TranslationProps['values']) {
  return typeof node === 'string' ? <Text message={node} values={values} /> : node;
}
