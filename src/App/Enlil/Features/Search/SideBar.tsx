import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import cx from 'classnames';
import React, { Fragment, useEffect, useState } from 'react';
import Text from '../../../../../src/ui/components/Text';
import { withThemeNext } from '../../../../ui/layout/theme-next';
import useStyles from './SearchPage.styles';
import { FacetOption, FacetPayload } from './types';

interface Props {
  options: FacetOption[]
  onChange?: (data: FacetPayload[]) => void
}

const SideBar: React.FC<Props> = ({ onChange, options }) => {
  const classes = useStyles();

  const [openedItems, setOpenedItems] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<FacetOption[]>([]);

  const isItemOpened = (id: string) => openedItems.includes(id);
  const isItemChecked = (group: string) => checkedItems.some(item => item.group === group);

  useEffect(() => {
    setCheckedItems(options);
  }, [options]);

  useEffect(() => {
    if (checkedItems && onChange) {
      onChange(checkedItems);
    }
  }, [checkedItems]);

  const toggleOpened = (id: string) => {
    setOpenedItems(
      (prevState) =>
        isItemOpened(id)
          ? prevState.filter((item) => item !== id)
          : [...prevState, id],
    );
  };

  const allowMultiple = true;

  const toggleChecked = (option: FacetOption, checked: boolean) => {
    if (!allowMultiple) {
      checked ? setCheckedItems([option]) : setCheckedItems([]);
      return;
    }
    setCheckedItems(
      (prevState) =>
        checked
          ? [...prevState, option]
          : prevState.filter((item) => item.group !== option.group),
    );
  };

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
      <List
        dense
        disablePadding
        className={classes.listRoot}
      >
        {options.map((option) => (
          <Fragment key={option.group}>
            <ListItem
              className={classes.listItem}
              button
            >
              {/* {option.items && (
                <IconButton
                  kind="simple"
                  className={classes.toggleButton}
                  onClick={() => toggleOpened(option.id)}
                >
                  <FontAwesomeIcon
                    icon={regular('chevron-down')}
                    className={cx(classes.collapsedIcon, { [classes.expandedIcon]: isItemOpened(option.id) })}
                  />
                </IconButton>
              )} */}
              <ListItemIcon className={classes.listCheckboxWrap}>
                <Checkbox
                  checked={isItemChecked(option.group)}
                  onChange={(e, checked) => toggleChecked(option, checked)}
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
                {option.group} {option.total ? `(${option.total})` : null}
              </ListItemText>
            </ListItem>
            {/* {option.items && (
              <Collapse in={isItemOpened(option.id)} timeout="auto">
                <List
                  dense
                  disablePadding
                  className={classes.listChild}
                >
                  {option.items.map((item) => (
                    <ListItem
                      button
                      key={item.id}
                      className={classes.listItem}
                    >
                      <ListItemIcon className={classes.listCheckboxWrap}>
                        <Checkbox
                          checked={isItemChecked(item.id) || isItemChecked(option.id)}
                          disabled={isItemChecked(option.id)}
                          onChange={(e, checked) => toggleChecked(item, checked)}
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
                        {item.group} {item.count ? `(${item.count})` : null}
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )} */}
          </Fragment>
        ))}
      </List>
    </Box>
  );
};

export default withThemeNext(SideBar);
