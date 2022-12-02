/* eslint-disable no-console */
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import Text from "../../components/Text";
import useStyles from "./ChangeOrderGrid.styles";
import ChangeOrderGridHeader from "./ChangeOrderGridHeader";
import ChangeOrderViewGridItem from "./ChangeOrderViewGridItem";
import { ChangeOrderGridItem } from "./ItemsAndDetails.types";


const TopSection: React.FunctionComponent<{
  showButton?: boolean;
  showEditRow: () => void;
}> = ({
  showButton = true,
  showEditRow,
}) => {
  const classes = useStyles();
  return (
    <div>
      <Grid className={classes.gridCenterAlign} container>
        <Grid item>
          <Typography variant="h6" id="sectionTitle" component="div">
            <Text translation="changeorder.items.section.heading"/>
          </Typography>
        </Grid>

        { showButton &&
            <Grid item>
              <Typography>
                <Button
                  className={classes.btnMargin}
                  color="primary"
                  startIcon={<AddCircleIcon color="primary" />}
                  onClick={showEditRow}
                >
                  <Text translation="changeorder.items.button.addText"/>
                </Button>
              </Typography>
            </Grid>
        }
      </Grid>
      <Divider className={classes.dividerStyle} />
    </div>
  );
};


const ItemsAndDetails: React.FunctionComponent<{
  entries: ChangeOrderGridItem[];
  generateDocTitleText: (docId: string, displayRevision: string, name: string) => string;
}> = ({
  entries,
  generateDocTitleText,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.fullWidth}>
      <TopSection showEditRow={() => console.log("Clicked")}/>
      <ChangeOrderGridHeader />
      {
        entries.map((entry: ChangeOrderGridItem) => (
          <ChangeOrderViewGridItem
            key={`fb-document-revision-${entry.id}`}
            {...entry}
            generateDocTitleText={generateDocTitleText}
          />
        ))
      }
    </div>
  );
};

export default ItemsAndDetails;
