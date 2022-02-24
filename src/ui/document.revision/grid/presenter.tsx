import { Box, Button, Grid } from "@material-ui/core";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Text from "../../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import GridTitle from "./GridTitle";
import { KendoPresenterProps } from "./interfaces";
import { KendoGrid } from "./KendoGrid";
import styles from "./presenter.styles";


export function DocumentListPresenter({
  statuses,
  tableName,
  tableCriteria,
  schema,
  columns,
}: KendoPresenterProps) {
  const classes = styles();
  return (
    <Box m={2}>
      <Grid container={true}>
        <GridTitle translation="navigation.document.list" />
        <Grid item={true}>
          <RouterLink to={DOCUMENT_REVISION_CREATE_URL} style={{ textDecoration: "none" }}>
            <Button
              className={classes.createDocButton}
              id="ListPresenter-create"
              data-cy="document.revision.create"
            >
              <Text translation="document.revision.create" />
            </Button>
          </RouterLink>
        </Grid>
        <Grid item={true} xs={12}>
          <KendoGrid
            tableName={tableName}
            tableCriteria={tableCriteria}
            schema={schema}
            columns={columns}
            statuses={statuses}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
