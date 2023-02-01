import { Button, Divider, Grid, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import cx from "classnames";
import { map } from "lodash";
import { useObserver } from "mobx-react";
import React, { useState } from "react";
import Text from "../../components/Text";
import { FBFormState } from "../../form.builder";
import Colors from "../../layout/theme-next/colors";
import ApprovalRequestEditGridItem from "./ApprovalRequestEditGridItem";
import useStyles from "./ApprovalRequestGrid.styles";
import ApprovalRequestGridHeader from "./ApprovalRequestGridHeader";
import ApprovalRequestItem from "./ApprovalRequestItem";
import ItemsAndDetailsState from "./ItemsAndDetails.state";
import { ApprovalRequestGridItem } from "./ItemsAndDetails.types";


const Loader = () => {
  const classes = useStyles();
  return (
    <div className={classes.loader}>Loading ...</div>
  );
};

const TopSection: React.FunctionComponent<{
  isButtonShown?: boolean;
  showEditRow: () => void;
}> = ({
  isButtonShown = true,
  showEditRow,
}) => {
  const classes = useStyles();
  return (
    <div>
      <Grid className={classes.gridCenterAlign} container>
        <Grid item>
          <Typography variant="h6" id="sectionTitle" component="div" style={{ color: Colors.textBlack }}>
            <Text translation="approvalRequest.items.section.heading"/>
          </Typography>
        </Grid>

        <Grid item>
          <Typography>
            <Button
              className={classes.btnMargin}
              disabled={!isButtonShown}
              color="primary"
              startIcon={<AddCircleIcon color="primary" />}
              onClick={isButtonShown ? showEditRow : (e) => e.preventDefault()}
            >
              <Text translation="approvalRequest.items.button.addText"/>
            </Button>
          </Typography>
        </Grid>
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
    return map(itemsAndDetailsState?.approvalRequestItemsList, "proposedDocumentRevision.id");
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
      { itemsAndDetailsState.loadingState && <Loader /> }
      <TopSection showEditRow={showEditRow} isButtonShown={itemsAndDetailsState.viewItemActionsVisible}/>
      <ApprovalRequestGridHeader />
      { isEditRowVisible && <ApprovalRequestEditGridItem
        {...{ formState }}
        disabledOptions={disabledOptions()}
        addRevisionToChangeRequest={addRevisionToChangeRequest}
        resetAndCancelEdit={resetAndCancelEdit}
      />}
      {
        itemsAndDetailsState.approvalRequestItemsList.map((entry: ApprovalRequestGridItem) => (
          <ApprovalRequestItem
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
