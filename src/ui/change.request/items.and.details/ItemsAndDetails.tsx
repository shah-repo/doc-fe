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
import ItemsAndDetailsState from "./ItemsAndDetails.state";
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
  itemsAndDetailsState: ItemsAndDetailsState;
}> = ({
  formState,
  handleAdd,
  handleRemove,
  handleUpdate,
  itemsAndDetailsState,
}) => {
  const classes = useStyles();
  const [isEditRowVisible, setIsEditRowVisible] = useState(false);

  const showEditRow = () => {
    setIsEditRowVisible(true);
    itemsAndDetailsState.setViewItemActionsVisibility(false);
  };

  function disabledOptions(): string[] {
    return map(itemsAndDetailsState?.changeOrderItemsList, "proposedDocumentRevision.id");
  }

  function resetAndCancelEdit() {
    formState.reset();
    setIsEditRowVisible(false);
    itemsAndDetailsState.setViewItemActionsVisibility(true);
  }

  function addRevisionToChangeRequest() {
    setIsEditRowVisible(false);
    handleAdd();
  }

  return useObserver(() => (
    <div className={cx(classes.tabContent, {
      [classes.tabContentInactive]: itemsAndDetailsState.loadingState,
    })}>
      <TopSection showEditRow={showEditRow} showButton={itemsAndDetailsState.viewItemActionsVisible}/>
      <ChangeOrderGridHeader />
      { isEditRowVisible && <ChangeOrderEditGridItem
        {...{ formState }}
        disabledOptions={disabledOptions()}
        addRevisionToChangeRequest={addRevisionToChangeRequest}
        resetAndCancelEdit={resetAndCancelEdit}
      />}
      {
        itemsAndDetailsState.changeOrderItemsList.map((entry: ChangeOrderGridItem) => (
          <ChangeOrderItem
            key={`fb-document-revision-${entry.id}`}
            entry={entry}
            {...{ formState }}
            disabledOptions={disabledOptions}
            handleRemove = {handleRemove}
            handleUpdate = {handleUpdate}
            viewItemActionsVisible = {itemsAndDetailsState.viewItemActionsVisible}
            itemsAndDetailsState = {itemsAndDetailsState}
          />
        ))
      }
    </div>
  ));
};

export default ItemsAndDetails;
