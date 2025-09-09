import { Grid } from '@material-ui/core';
import React from 'react';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import SearchBar from '../../components/KeywordSearch';
import { Translation } from '../../translations/types';

interface GridHeaderWithSearchProps {
  titleTranslationKey: Translation
  tableName: string
}

const GridHeaderWithSearch: React.FC<GridHeaderWithSearchProps> = ({
  titleTranslationKey,
  tableName,
}) => {
  return (
    <Grid item>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <GridTitle translation={titleTranslationKey } />
        </Grid>
        <Grid item xs>
          <SearchBar tableName={tableName} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridHeaderWithSearch;
