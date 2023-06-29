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

interface ItemChange {
  id: string
  checked: boolean
}

interface OwnFacet extends Omit<Facet, 'children'> {
  checked: boolean
  children?: OwnFacet[]
}

const FacetItem: React.FC<{ facet: OwnFacet, onChange?: (item: ItemChange) => void }> = (props) => {
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
            checked={Boolean(isChecked || children?.some(item => item.checked))}
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

const FacetsList: React.FC<{ facets: OwnFacet[], isChild?: boolean, onChange?: (item: ItemChange) => void }> = ({ facets, isChild = false, onChange }) => {
  const classes = useStyles();

  return (
    <List
      dense
      disablePadding
      className={isChild ? classes.listChild : classes.listRoot}
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

const SideBar: React.FC<{ facets?: Facet[], onChange?: (data: string[]) => void }> = ({ onChange, facets = [] }) => {
  const classes = useStyles();

  const [checkedFacetIds, setCheckedFacetIds] = useState<string[]>([]);

  useEffect(() => {
    if (checkedFacetIds && onChange) {
      onChange(checkedFacetIds);
    }
  }, [onChange, checkedFacetIds]);

  const handleDeselect = () => {
    setCheckedFacetIds([]);
  };

  const handleFacetsChange = ({ id, checked }: ItemChange) => {
    setCheckedFacetIds(checkedIds => {
      if (checked && !checkedIds.includes(id)) {
        return [...checkedIds, id];
      }

      if (!checked) {
        return checkedIds.filter(checkedId => checkedId !== id);
      }

      return checkedIds;
    });
  };

  const mapOwnFacets = (facets: Facet[]): OwnFacet[] => facets.map(facet => ({
    ...facet,
    checked: checkedFacetIds.includes(facet.id),
    ...facet.children && { children: mapOwnFacets(facet.children) },
  } as OwnFacet));

  const ownFacets = mapOwnFacets(facets);

  return (
    <Box>
      <Box className={classes.toolbar}>
        <Box>Refine By</Box>
        {checkedFacetIds.length > 0 && (
          <Box
            className={classes.selectButton}
            onClick={handleDeselect}
          >
            <Text message="common.deselect.all" />
          </Box>
        )}
      </Box>
      <FacetsList
        facets={ownFacets}
        onChange={handleFacetsChange}
      />
    </Box>
  );
};

export default withThemeNext(SideBar);
