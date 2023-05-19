import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import GridTitle from '../../components/KendoGrid/GridTitle/presenter';
import { KendoPresenterProps } from '../../components/KendoGrid/interfaces';
import { KendoGrid } from '../../components/KendoGrid/KendoGrid';
import KendoGridStyles from '../../components/KendoGrid/KendoGrid.styles';
import { DOCUMENT_REVISION_CREATE_URL } from '../../constants/urls';
import { documentRevisionQueryStatus } from '../utils/helpers';
import CreateButton from './CreateButton/presenter';
import ExportButton from './ExportButton/presenter';

export function DocumentListPresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
  onRowClick,
  queryUrl,
}: KendoPresenterProps) {
  const classes = KendoGridStyles();
  const [dataToBeExported, setDataToBeExported] = useState<DocumentRevision[]>([]);
  const handleExportData = (dataToBeExported: DocumentRevision[]) => {
    setDataToBeExported(dataToBeExported);
  };
  const isGrouped = tableCriteria?.queryDict?.dataState?.group?.length > 0;
  return (
    <Grid container>
      <Grid item xs={12} className={classes.headerGridItem}>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <GridTitle translation="navigation.document.list" />
          </Grid>
          <Grid item>
            <ExportButton columns={columns} gridData={dataToBeExported} isGrouped={isGrouped}/>
            <CreateButton url={DOCUMENT_REVISION_CREATE_URL} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.kendoGridItem}>
        <KendoGrid<DocumentRevision>
          tableName={tableName}
          tableCriteria={tableCriteria}
          schema={schema}
          statuses={statuses}
          exportDataChanges={handleExportData}
          onRowClick={onRowClick}
          queryUrl={queryUrl}
          defaultPayloadData={{
            documentTypeWithoutCategory: 'true',
            status: documentRevisionQueryStatus(),
          }}
        />
      </Grid>
    </Grid>
  );
}
