import { Grid, List } from "@material-ui/core";
import moment from "moment";
import React from "react";
import {
  RecentItems,
  RecentTypes,
} from "../../../state/ducks/dashboard.new/recents/types";
import { ActionCreator } from "redux";
import { ApiAction } from "../../../state/types";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import Text from "../../components/Text";
import RecentsItem from "./Recents.item";
import { styles } from "./Recents.styles";

interface Props {
  loadRecents: ActionCreator<ApiAction<RecentItems[], any>>;
  loadRecentsListAsyncState: AsyncState;
  recents: RecentItems[];
}

const RecentsPresenter: React.FunctionComponent<Props> = ({
  loadRecents,
  loadRecentsListAsyncState,
  recents,
}) => {
  const classes = styles();
  const renderItems = () => (
    <List className={classes.root}>
      {recents.map((data, index) => {
        switch (data.itemType) {
          case RecentTypes.DOCUMENT:
            return (
              <RecentsItem
                key={index}
                itemId={data.itemId}
                docId={data.docId}
                itemType={data.itemType}
                docTypeGroup={data.docTypeGroup}
                docRevId={data.docRevId}
                docTitle={data.docTitle}
                accessedAt={moment
                  .utc(data.accessedAt)
                  .local()
                  .startOf("seconds")
                  .fromNow()}
              />
            );
          case RecentTypes.CHANGE_REQUEST:
            return (
              <RecentsItem
                key={index}
                itemId={data.itemId}
                docId={data.docId}
                itemType={data.itemType}
                docTypeGroup={data.docTypeGroup}
                docRevId={data.docRevId}
                docTitle={data.docTitle}
                accessedAt={moment
                  .utc(data.accessedAt)
                  .local()
                  .startOf("seconds")
                  .fromNow()}
              />
            );
          default:
            return <Text key={index} translation="common.undefined" />;
        }
      })}
    </List>
  );

  return (
    <Grid container={true} spacing={5} className={classes.grid}>
      <Grid item={true} sm={12}>
        <AsyncGate
          asyncAction={loadRecents}
          asyncState={loadRecentsListAsyncState}
          startActionOnMount={true}
        >
          {renderItems()}
        </AsyncGate>
      </Grid>
    </Grid>
  );
};
export default RecentsPresenter;
