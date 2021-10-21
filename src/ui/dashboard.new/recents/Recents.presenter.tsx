import { Grid, List } from "@material-ui/core";
import React from "react";
import { Recent } from "../../../state/ducks/dashboard.new/types";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import RecentsItem from "./Recents.item";
import { styles } from "./Recents.styles";

interface Props {
  loadRecents: any;
  loadRecentsListAsyncState: AsyncState;
  recents: Recent[];
  recentsData: any;
}

const RecentsPresenter: React.FunctionComponent<Props> = ({
  loadRecents,
  loadRecentsListAsyncState,
  recents,
  recentsData,
}) => {
  // eslint-disable-next-line no-console
  console.log("Recents API Data:: ", recents);
  const classes = styles();
  const renderItems = () => (
    <List className={classes.root}>
      {recentsData.map((data, index) => (
        <RecentsItem
          key={index}
          id={data.id}
          docId={data.docId}
          type={data.type}
          title={data.title}
          createdAt={data.createdAt}
        />
      ))}
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
