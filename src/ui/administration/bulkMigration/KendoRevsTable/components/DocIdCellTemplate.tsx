import { get } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { documentVersionPath } from '../../../../document.revision/utils/paths';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

export const DocIdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const classes = useStyles();
  const { field, dataItem } = props;
  const { docRevId, documentId } = dataItem;
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER);

  const linkHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <Link to={documentVersionPath(docRevId, documentId)} target="_blank" className={classes.link} onClick={linkHandler}>
      {displayValue}
    </Link>
  );
};
