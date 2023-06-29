import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Collapse } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import Text from '../../../../../src/ui/components/Text';
import { withThemeNext } from '../../../../ui/layout/theme-next';
import useStyles from './SearchPage.styles';
import { Facet } from './types';
import { IconButton } from '../../../../ui/components/forms/fields-next';

interface Props {
  facets?: Facet[]
  onChange?: (data: Facet[]) => void
}

const FacetItem: React.FC<Facet> = ({ count, label, children }) => {
  const classes = useStyles();

  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <ListItem
        className={classes.listItem}
        button
      >
        {children && (
          <IconButton
            kind="simple"
            className={classes.toggleButton}
            onClick={() => setIsOpened(value => !value)}
          >
            <FontAwesomeIcon
              icon={regular('chevron-down')}
              className={cx(classes.collapsedIcon, { [classes.expandedIcon]: isOpened })}
            />
          </IconButton>
        )}
        <ListItemIcon className={classes.listCheckboxWrap}>
          <Checkbox
            onChange={console.log}
            className={classes.listCheckbox}
            color="default"
            checkedIcon={
              <span className={cx(classes.checkboxIcon, classes.checkboxIconChecked)}>
                <FontAwesomeIcon
                  icon={solid('check')}
                  className={classes.checkboxCheck}
                />
              </span>
            }
            icon={<span className={classes.checkboxIcon} />}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText>
          {label}{count ? ` (${count})` : null}
        </ListItemText>
      </ListItem>
      {children && (
        <Collapse in={isOpened} timeout="auto">
          <FacetsList facets={children} isChild />
        </Collapse>
      )}
    </>
  );
};

const FacetsList: React.FC<{ facets: Facet[], isChild?: boolean }> = ({ facets, isChild = false }) => {
  const classes = useStyles();

  return (
    <List
      dense
      disablePadding
      className={isChild ? classes.listChild : classes.listRoot}
    >
      {facets.map(item => <FacetItem key={item.id} {...item} />)}
    </List>
  );
};

const SideBar: React.FC<Props> = ({ onChange, facets = [] }) => {
  const classes = useStyles();

  const [checkedItems, setCheckedItems] = useState<Facet[]>([]);

  useEffect(() => {
    setCheckedItems(facets);
  }, [facets]);

  useEffect(() => {
    if (checkedItems && onChange) {
      onChange(checkedItems);
    }
  }, [onChange, checkedItems]);

  const handleDeselect = () => {
    checkedItems.length && setCheckedItems([]);
  };

  return (
    <Box>
      <Box className={classes.toolbar}>
        <Box>Refine By</Box>
        {checkedItems.length > 0 && (
          <Box
            className={classes.selectButton}
            onClick={handleDeselect}
          >
            <Text message="common.deselect.all" />
          </Box>
        )}
      </Box>
      <FacetsList facets={facets} />
    </Box>
  );
};

export default withThemeNext(SideBar);
