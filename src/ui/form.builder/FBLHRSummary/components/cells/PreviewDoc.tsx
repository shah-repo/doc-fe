import { Box } from '@material-ui/core';
import { kebabCase } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { EMPTY_PLACEHOLDER } from '../../constants';
import {
  DetailsObj,
  EditableLHRSummaryItem,
  EditableLHRSummaryItemEditEvent,
} from '../../types';
import { getDisplayDocument } from '../../utils';
import { InvalidDocIndicator } from './InvalidDocIndicator';
import { styles } from './styles';

interface props {
  detailsObj: DetailsObj
  dataItem: EditableLHRSummaryItem
  onClick?: (event: EditableLHRSummaryItemEditEvent) => void
  field: string
}

export const PreviewDoc: React.FC<props> = ({
  dataItem,
  detailsObj,
  onClick,
  field,
}) => {
  const classes = styles();
  const { docId, documentId, displayRevision, value, displayStatus }
    = detailsObj ?? {};
  const dataCy = `${kebabCase(field)}-cell`;

  if (!documentId) {
    return (
      <Box onClick={() => onClick?.({ dataItem })} data-cy={dataCy}>
        {value ?? EMPTY_PLACEHOLDER}
      </Box>
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
        {getDisplayDocument(docId, displayRevision)}
      </Link>
      <InvalidDocIndicator status={displayStatus} dataCy={`${dataCy}-invalid-indicator`} />
    </Box>
  );
};
