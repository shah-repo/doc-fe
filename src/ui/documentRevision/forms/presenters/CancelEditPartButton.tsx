import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { translate } from '../../../../common/intl';
import { ChangeControlOptions, DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import { Button, ButtonGroup } from '../../../components/forms/fields-next';
import Text from '../../../components/Text';
import Colors from '../../../layout/theme/utils/colors';

interface Props {
  documentRevision: DocumentRevision
  cancelPartEdit: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1, 2, 1, 1),
      marginTop: theme.spacing(0.5),
      backgroundColor: Colors.white,
      boxShadow: `4px 4px 8px 4px ${Colors.blue_bell}`,
      right: theme.spacing(1.25),
    },
    controlOptionsInfo: {
      width: 16,
      height: 16,
      color: Colors.light_slate_blue,
    },
    heading: {
      color: Colors.dark_gray,
    },
    formDetails: {
      color: Colors.bright_grey,
      paddingLeft: theme.spacing(0.5),
    },
    optionsList: {
      listStyle: 'none',
      paddingLeft: 0,
      margin: theme.spacing(1, 0.5, 0.5, 0.5),
    },
    listItem: {
      marginBottom: theme.spacing(1),
    },
    listItemLabel: {
      fontSize: '13px',
      color: Colors.dark_gray,
    },
    listItemValue: {
      marginLeft: theme.spacing(0.5),
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
    handlePopoverOpen(event);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const changeControlOptions = documentRevision.changeControlOptions as ChangeControlOptions;
  const formInput = changeControlOptions?.formInput ?? {};
  const schemaMap = changeControlOptions?.schemaMap ?? {};
  const { docId, displayRevision } = changeControlOptions;

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
          {Object.keys(formInput).map((key: string) => (
            <li key={key} className={classes.listItem}>
              <span className={classes.listItemLabel}>{schemaMap[key]}</span> -
              <span className={classes.listItemValue}>{formInput[key]}</span>
            </li>
          ))}
        </ul>
      </Popover>
    </ButtonGroup>
  );
};

export default CancelEditPartButton;
