import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Typography } from '@material-ui/core';
import cx from 'classnames';
import React, { useState } from 'react';
import { translate } from '../../../../common/intl';
import { ChangeControlOptions, DocumentRevision, DocumentRevisionStatus } from '../../../../state/ducks/documentRevisions/types';
import Text from '../../../components/Text';
import { Button, ButtonGroup } from '../../../components/forms/fields-next';
import { BOM_FIELDS_CHANGES_KEY, BOM_LINE_CHANGES_KEY, cccKeyNamesOrder } from '../../../document.revision/utils/helpers';
import useStyles from './cancelEditPartButton.styles';

interface Props {
  documentRevision: DocumentRevision
  cancelPartEdit: () => void
}

const CancelEditPartButton: React.FunctionComponent<Props> = ({
  documentRevision,
  cancelPartEdit,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const showAssociatedControlOptions = (event) => {
    handlePopoverOpen(event);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const changeControlOptions = (documentRevision.changeControlOptions ?? {}) as ChangeControlOptions;
  const formInput = changeControlOptions?.formInput ?? {};
  const schemaMap = changeControlOptions?.schemaMap ?? {};
  const { docId, displayRevision } = changeControlOptions;

  let cccKeyNamesToUse = cccKeyNamesOrder;
  if (formInput[BOM_LINE_CHANGES_KEY] === 'Yes') {
    cccKeyNamesToUse = cccKeyNamesToUse.filter(keyName => keyName !== BOM_FIELDS_CHANGES_KEY);
  }

  return (
    <ButtonGroup
      kind="white"
    >
      <Button
        id="cancelEditPartButton"
        data-cy="cancelEditPartButton"
        onClick={cancelPartEdit}
        className={cx(classes.buttonText, { [classes.disabled]: documentRevision.status !== DocumentRevisionStatus.Draft })}
      >
        <Text message="Cancel Edit" />
      </Button>
      <Button
        id="controlOptionsInfoButton"
        data-cy="controlOptionsInfoButton"
        onClick={showAssociatedControlOptions}
        className={classes.buttonIcon}
      >
        <FontAwesomeIcon
          className={classes.controlOptionsInfo}
          color="secondary"
          icon={regular('circle-exclamation')}
        />
      </Button>
      <Popover
        id="controlOptions-popover"
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography variant="h5" component="h5" className={classes.heading}>{translate('documentRevision.change.control.config.title')}
          <span className={classes.formDetails}>{docId} rev{displayRevision}</span>
        </Typography>
        <ul className={classes.optionsList}>
          {cccKeyNamesToUse.map((key: string) => (
            <>
              { schemaMap[key] && <li key={key} className={classes.listItem}>
                <span className={classes.listItemLabel}>{schemaMap[key]}</span> -
                <span className={classes.listItemValue}>{key === BOM_FIELDS_CHANGES_KEY ? formInput[key]?.join(' , ') : formInput[key]}</span>
              </li>}
            </>
          ))}
        </ul>
      </Popover>
    </ButtonGroup>
  );
};

export default CancelEditPartButton;
