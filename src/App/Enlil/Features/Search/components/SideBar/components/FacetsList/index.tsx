import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { withThemeNext } from '../../../../../../../../ui/layout/theme-next';
import useStyles from './styles';
import { IconButton } from '../../../../../../../../ui/components/forms/fields-next';
import { FacetItemProps, FacetsListProps } from '.';

const FacetItem: React.FC<FacetItemProps> = (props) => {
  const { facet: { id, count, label, children, checked }, onChange } = props;

  const classes = useStyles();

  const [isChecked, setIsChecked] = useState(checked);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleItemClick = () => setIsChecked(value => {
    const newValue = !value;

    if (children) {
      children.forEach(({ id }) => {
        onChange?.({ id, checked: newValue });
      });
    } else {
      onChange?.({ id, checked: newValue });
    }

    return newValue;
  });

  const iconIsCheck = !children || children?.every(item => item.checked);

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
            checked={isChecked}
            onClick={handleItemClick}
            className={classes.listCheckbox}
            color="default"
            checkedIcon={
              <span className={cx(classes.checkboxIcon, classes.checkboxIconChecked)}>
                <FontAwesomeIcon
                  icon={iconIsCheck ? solid('check') : solid('minus')}
                  className={classes.checkboxCheck}
                />
              </span>
            }
            icon={<span className={classes.checkboxIcon} />}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText onClick={handleItemClick}>
          {label}{count ? ` (${count})` : null}
        </ListItemText>
      </ListItem>
      {children && (
        <Collapse in={isOpened} timeout="auto">
          <FacetsList
            facets={children}
            onChange={onChange}
            isChild
          />
        </Collapse>
      )}
    </>
  );
};

const FacetsList: React.FC<FacetsListProps> = (props) => {
  const { facets, isChild = false, onChange } = props;

  const classes = useStyles();

  return (
    <List
      dense
      disablePadding
      className={cx({ [classes.listChild]: isChild })}
    >
      {facets.map(facet => (
        <FacetItem
          key={facet.id}
          facet={facet}
          onChange={onChange}
        />
      ))}
    </List>
  );
};

export default withThemeNext(FacetsList);

export * from './types';
