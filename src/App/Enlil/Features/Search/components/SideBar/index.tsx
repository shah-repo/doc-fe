import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Text from '../../../../../../ui/components/Text';
import { withThemeNext } from '../../../../../../ui/layout/theme-next';
import useStyles from './styles';
import { Facet } from '../../types';
import FacetsList, { FacetOnChangeHandler, MappedFacet } from './components/FacetsList';
import { SideBarProps } from './types';

const SideBar: React.FC<SideBarProps> = (props) => {
  const { query, onChange, facets = [] } = props;

  const classes = useStyles();
  const [checkedFacetIds, setCheckedFacetIds] = useState<string[]>([]);

  useEffect(() => {
    setCheckedFacetIds([]);
  }, [query]);

  useEffect(() => {
    if (checkedFacetIds && onChange) {
      onChange(checkedFacetIds);
    }
  }, [onChange, checkedFacetIds]);

  const handleDeselect = () => {
    setCheckedFacetIds([]);
  };

  const handleFacetsChange: FacetOnChangeHandler = ({ id, checked }) => {
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

  const mapFacets = (facets: Facet[]): MappedFacet[] => facets.map(facet => {
    const mappedChildren = facet.children ? mapFacets(facet.children) : undefined;

    return ({
      ...facet,
      checked: checkedFacetIds.includes(facet.id) || Boolean(mappedChildren?.some(item => item.checked)),
      ...mappedChildren && { children: mappedChildren },
    } as MappedFacet);
  });

  const mappedFacets = mapFacets(facets);

  return (
    <Box>
      <Box className={classes.toolbar}>
        <Box>
          <Text message="search.facets.header" />
        </Box>
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
        facets={mappedFacets}
        onChange={handleFacetsChange}
      />
    </Box>
  );
};

export default withThemeNext(SideBar);
