import React from 'react';
import { truncateByMaxChars } from '../../../../../../components/common/header/Helpers';
import OverflowTooltip from '../../../../../../components/OverflowTooltip';
import { MAX_ASL_STATUS_CHAR_LIMIT } from '../../../../../../form.builder/FBProductOrService/constants';

export const ASLTruncatedTooltipText: React.FC<{ text: string }> = ({ text }) => (
  <OverflowTooltip arrow placement="top" title={text} forceTooltip={text.length > MAX_ASL_STATUS_CHAR_LIMIT}>
    {truncateByMaxChars(text, MAX_ASL_STATUS_CHAR_LIMIT)}
  </OverflowTooltip>
);
