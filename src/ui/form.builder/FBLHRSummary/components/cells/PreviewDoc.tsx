import { Box } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { EMPTY_PLACEHOLDER } from '../../constants';
import { DetailsObj, EditableLHRSummaryItem, EditableLHRSummaryItemEditEvent } from '../../types';
import { getDisplayDocument } from '../../utils';
import { InvalidDocIndicator } from './InvalidDocIndicator';
import { styles } from './styles';

interface props {
  detailsObj?: DetailsObj
  dataItem: EditableLHRSummaryItem
  isRevRemoved?: boolean
  onClick?: (event: EditableLHRSummaryItemEditEvent) => void
  field: string
}

export const PreviewDoc: React.FC<props> = ({
  dataItem,
  detailsObj,
  isRevRemoved,
  onClick,
  field,
}) => {
  const classes = styles();
  const { docId, documentId, displayRevision, value, displayStatus }
    = detailsObj ?? {};
  const dataCy = `${kebabCase(field)}-cell`;

  if (!documentId) {
    const fieldValue = value ?? EMPTY_PLACEHOLDER;
    return (
      <OverflowTooltip
        title={fieldValue}
        placement="top"
        interactive
        arrow
        onClick={() => onClick?.({ dataItem })}
        data-cy={dataCy}
      >
        {fieldValue}
      </OverflowTooltip>
    );
  }

  return (
    <Box
      onClick={() => onClick?.({ dataItem })}
      display="flex"
      justifyContent="space-between"
    >
      <Link
        to={documentVersionPath(value ?? '', documentId)}
        target="_blank"
        data-cy={dataCy}
        className={classes.link}
      >
        <OverflowTooltip
          title={getDisplayDocument(docId, displayRevision)}
          placement="top"
          interactive
          arrow
          data-cy={dataCy}
        >
          {getDisplayDocument(docId, displayRevision)}
        </OverflowTooltip>
      </Link>
      <InvalidDocIndicator status={displayStatus} isRevRemoved={isRevRemoved} dataCy={`${dataCy}-invalid-indicator`} />
    </Box>
  );
};
