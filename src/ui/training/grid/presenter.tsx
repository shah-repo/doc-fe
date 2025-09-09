import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { TrainingListData } from '../../../state/ducks/training/types';
import { KendoGrid } from '../../components/KendoGrid/KendoGrid';
import KendoGridStyles from '../../components/KendoGrid/KendoGrid.styles';
import GridHeaderWithSearch from '../../components/KeywordSearch/GridHeaderWithSearch';
import { SearchProvider } from '../../components/KeywordSearch/SearchProvider';
import ExportButton from './ExportButton';
import { KendoPresenterProps } from './interfaces';

export function TrainingListPresenter ({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  onRowClick,
  queryUrl,
  defaultPayloadData,
}: KendoPresenterProps) {
  const classes = KendoGridStyles();
  const [dataToBeExported, setDataToBeExported] = useState<TrainingListData[]>([]);
  const isGrouped = tableCriteria?.queryDict?.dataState?.group?.length > 0;

  return (
    <Grid container>
      <SearchProvider>
        <Grid item xs={12} className={classes.headerGridItem}>
          <Grid container alignItems="center" justify="space-between">
            <GridHeaderWithSearch titleTranslationKey="page.title.training" tableName={tableName} />
            <Grid item>
              <ExportButton columns={columns} gridData={dataToBeExported} isGrouped={isGrouped} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.kendoGridItem}>
          <KendoGrid
            tableName={tableName}
            tableCriteria={tableCriteria}
            schema={schema}
            exportDataChanges={setDataToBeExported}
            onRowClick={onRowClick}
            queryUrl={queryUrl}
            defaultPayloadData={defaultPayloadData}
          />
        </Grid>
      </SearchProvider>
    </Grid>
  );
}
