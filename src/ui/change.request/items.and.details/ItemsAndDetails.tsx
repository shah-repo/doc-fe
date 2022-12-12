/* eslint-disable no-console */
import { Button, Divider, Grid, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import cx from "classnames";
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

  const showEditRow = () => {
    setIsEditRowVisible(true);
    itemsAndDetailsStore.setViewItemActionsVisibility(false);
  };

  function disabledOptions(): string[] {
    return map(itemsAndDetailsStore?.changeOrderItemsList, "proposedDocumentRevision.id");
  }

  function resetAndCancelEdit() {
    formState.reset();
    setIsEditRowVisible(false);
    itemsAndDetailsStore.setViewItemActionsVisibility(true);
  }

  function addRevisionToChangeRequest() {
    setIsEditRowVisible(false);
    handleAdd();
  }

  return useObserver(() => (
    <div className={cx(classes.tabContent, {
      [classes.tabContentInactive]: itemsAndDetailsStore.loadingState,
    })}>
      <TopSection showEditRow={showEditRow} showButton={itemsAndDetailsStore.viewItemActionsVisible}/>
      <ChangeOrderGridHeader />
      { isEditRowVisible && <ChangeOrderEditGridItem
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
            viewItemActionsVisible = {itemsAndDetailsStore.viewItemActionsVisible}
          />
        ))
      }
    </div>
  ));
};

export default ItemsAndDetails;
