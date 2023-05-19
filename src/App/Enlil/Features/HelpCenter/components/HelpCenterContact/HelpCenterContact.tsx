import { ListItemIcon, ListItemText, MenuList } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { ReactComponent as SendIcon } from '../../../../../../assets/images/send.svg';
import Text from '../../../../../../ui/components/Text';
import StaticHelpLinks from '../../data/static-links';
import HelpCenterExternalLink from '../HelpCenterExternalLink/HelpCenterExternalLink';
import HelpCenterOutLink from '../HelpCenterOutLink/HelpCenterOutLink';
import useStyles from './HelpCenterContact.styles';

const HelpCenterContact: React.FC = () => {
  const classes = useStyles();

  return (
    <MenuList className={classes.list} dense disablePadding>
      <HelpCenterExternalLink
        className={cx(classes.link, classes.contact)}
        to={StaticHelpLinks.Contact}
        dataCy="help-center.contact.contact"
      >
        <ListItemIcon className={classes.icon}><SendIcon /></ListItemIcon>
        <ListItemText className={classes.text}>
          <Text translation="help.didnt.find.what.you.need" />
          <HelpCenterOutLink className={classes.out}>
            <Text translation="help.contact" />
          </HelpCenterOutLink>
        </ListItemText>
      </HelpCenterExternalLink>
    </MenuList>
  );
};

export default HelpCenterContact;
