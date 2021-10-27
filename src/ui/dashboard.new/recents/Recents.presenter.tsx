import { Grid, List } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { RecentType } from "../../../state/ducks/dashboard.new/types";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import Text from "../../components/Text";
import RecentsItem from "./Recents.item";
import { styles } from "./Recents.styles";

interface Props {
  loadRecents: any;
  loadRecentsListAsyncState: AsyncState;
  recents: any; // TO DO:: type definition needs to be added
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
          case RecentType.DOCUMENT:
            return (
              <RecentsItem
                key={index}
                index={index}
                id={data.document.id}
                docId={data.document.docId}
                type={data.document.documentType.group}
                revisionId={data.document.documentRevisions[0].id}
                title={data.document.documentRevisions[0].name}
                description={data.document.documentRevisions[0].description}
                details={data.document.documentRevisions[0].precalc}
                accessedAt={moment
                  .utc(data.accessedAt)
                  .local()
                  .startOf("seconds")
                  .fromNow()}
              />
            );
          case RecentType.CHANGE_REQUEST:
            return (
              <RecentsItem
                key={index}
                index={index}
                id={data.changeRequest.id}
                docId={data.changeRequest.crId}
                type={data.itemType}
                title={data.changeRequest.title}
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
