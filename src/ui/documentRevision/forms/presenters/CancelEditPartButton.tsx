import React, { useState } from 'react';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { Button, ButtonGroup } from '../../../components/forms/fields-next';
import Text from '../../../components/Text';

import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import Colors from '../../../layout/theme/utils/colors';

import cx from 'classnames';

interface Props {
  documentRevision: DocumentRevision
  cancelPartEdit: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      // pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1, 2, 1, 1),
      marginTop: '4px',
      backgroundColor: Colors.white,
      boxShadow: `4px 4px 8px 0px ${Colors.blue_bell}`,
    },
    optionsList: {
      listStyle: 'none',
      paddingLeft: '0px',
      margin: '4px',
    },
    listItem: {
      marginBottom: '8px',
    },
    listItemLabel: {
      fontSize: '13px',
      color: Colors.dark_gray,
    },
    listItemValue: {
      marginLeft: '4px',
    },
    allowed: {
      color: Colors.green,
    },
    notAllowed: {
      color: Colors.error_red,
    },
  }),
);

const CancelEditPartButton: React.FunctionComponent<Props> = ({
  documentRevision,
  cancelPartEdit,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const showAssociatedControlOptions = (event) => {
    console.log(documentRevision.changeControlOptions);
    handlePopoverOpen(event);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const changeControlOptions = documentRevision.changeControlOptions;
  const formInput = changeControlOptions?.formInput ?? {};
  const schemaMap = changeControlOptions?.schemaMap ?? {};

  return (
    <ButtonGroup
      color="primary"
      variant="outlined"
    >
      <Button
        id="cancelEditPartButton"
        data-cy="cancelEditPartButton"
        onClick={cancelPartEdit}
      >
        <Text message="Cancel Edit" />
      </Button>
      <Button
        id="controlOptionsInfoButton"
        data-cy="controlOptionsInfoButton"
        onClick={showAssociatedControlOptions}
      >
        <FontAwesomeIcon
          style={{ width: 16, height: 16, color: Colors.light_slate_blue }}
          color="secondary"
          icon={regular('circle-exclamation')}
        />
      </Button>
      <Popover
        id="controlOptions-popover"
        className={classes.popover}
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
        <ul className={classes.optionsList}>
          {Object.keys(formInput).map((key: string) => (
            <li key={key} className={classes.listItem}>
              <span className={classes.listItemLabel}>{schemaMap[key]}</span> -
              <span className={cx(classes.listItemValue, formInput[key] === 'No'
                ? classes.allowed : classes.notAllowed)}>{formInput[key]}</span>
            </li>
          ))}
        </ul>
      </Popover>
    </ButtonGroup>
  );
};

export default CancelEditPartButton;
