/* eslint-disable no-console */
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { map } from "lodash";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import Text from "../../components/Text";
import { FBFormState } from "../../form.builder";
import ChangeOrderEditGridItem from "./ChangeOrderEditGridItem";
import useStyles from "./ChangeOrderGrid.styles";
import ChangeOrderGridHeader from "./ChangeOrderGridHeader";
import ChangeOrderItem from "./ChangeOrderItem";
import { useItemsAndDetailsStore } from "./ItemsAndDetails.state";
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
  formState: FBFormState;
  handleAdd: () => void;
  handleRemove: (docRevId: string) => void;
  handleUpdate: () => void;
}> = ({
  formState,
  handleAdd,
  handleRemove,
  handleUpdate,
}) => {
  const classes = useStyles();
  const { itemsAndDetailsStore } = useItemsAndDetailsStore();

  const [isEditRowVisible, setIsEditRowVisible] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const showEditRow = () => {
    setIsEditRowVisible(true);
    setShowButton(false);
  };

  function disabledOptions(): string[] {
    return map(itemsAndDetailsStore?.changeOrderItemsList, "proposedDocumentRevision.id");
  }

  function resetAndCancelEdit() {
    formState.reset();
    setIsEditRowVisible(false);
    setShowButton(true);
  }

  function addRevisionToChangeRequest() {
    setIsEditRowVisible(false);
    setShowButton(true);
    handleAdd();
  }

  return useObserver(() => (
    <div className={classes.fullWidth}>
      <TopSection showEditRow={showEditRow} showButton={showButton}/>
      <ChangeOrderGridHeader />
      { isEditRowVisible &&  <ChangeOrderEditGridItem
        {...{ formState }}
        disabledOptions={disabledOptions()}
        addRevisionToChangeRequest={addRevisionToChangeRequest}
        resetAndCancelEdit={resetAndCancelEdit}
      />}
      {
        itemsAndDetailsStore.changeOrderItemsList.map((entry: ChangeOrderGridItem) => (
          <ChangeOrderItem
            key={`fb-document-revision-${entry.id}`}
            entry={entry}
            {...{ formState }}
            disabledOptions={disabledOptions}
            handleRemove = {handleRemove}
            handleUpdate = {handleUpdate}
          />
        ))
      }
    </div>
  ));
};

export default ItemsAndDetails;
