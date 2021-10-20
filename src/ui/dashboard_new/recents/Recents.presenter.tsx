import { Grid, List } from "@material-ui/core";
import React from "react";
import RecentsItem from "./Recents.item";
import { styles } from "./Recents.styles";

interface Props {
  recentsData: any;
}

const RecentsPresenter: React.FunctionComponent<Props> = ({ recentsData }) => {
  const classes = styles();
  const renderItems = () => (
    <List dense className={classes.root}>
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
    </List>);

  return (
    <Grid container={true} spacing={5}>
      <Grid item={true} sm={12}>
        {renderItems()}
      </Grid>
    </Grid>
  );
};
export default RecentsPresenter;
