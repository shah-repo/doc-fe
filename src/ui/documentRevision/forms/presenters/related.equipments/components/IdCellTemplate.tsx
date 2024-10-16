import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles, Tooltip } from '@material-ui/core';
import { get } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { translate } from '../../../../../../common/intl';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../components/KendoDataGrid/constants';
import OverflowTooltip from '../../../../../components/OverflowTooltip';
import { documentVersionPath } from '../../../../../document.revision/utils/paths';
import { Colors } from '../../../../../layout/theme-next';
import { CustomTemplateProps } from '../types';

const styles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    color: Colors.error,
    fontSize: 16,
  },
  tooltip: {
    backgroundColor: Colors.error,
    color: Colors.white,
  },
  arrow: {
    color: Colors.error,
  },
}));

const IdCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, field } = props;
  const classes = styles();

  const path = field ?? '';
  const value = String(get(dataItem, path) ?? '');
  const { documentId, documentRevisionId, needSync } = dataItem;

  const parts = value.split('-');
  const lastPart = parts.pop();
  const boldValue = <>{parts.join('-')} - <b>{lastPart}</b></>;

  const label = value ? boldValue : EMPTY_VALUE_PLACEHOLDER;

  return (
    <div className={classes.container}>
      <OverflowTooltip
        arrow
        placement="top"
        title={label}
      >
        {documentId && documentRevisionId
          ? (
            <Link
              to={documentVersionPath(documentRevisionId, documentId)}
              target="_blank"
            >
              {label}
            </Link>
          )
          : label
        }
      </OverflowTooltip>
      {needSync && (
        <Tooltip
          classes={{
            tooltip: classes.tooltip,
            arrow: classes.arrow,
          }}
          arrow
          placement="top"
          title={translate('form.builder.related.equipments.need.sync.error.title')}
        >
          <FontAwesomeIcon
            className={classes.icon}
            icon={regular('rotate-exclamation')}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default IdCellTemplate;
