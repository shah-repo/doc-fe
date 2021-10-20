import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import React from "react";
import { ReactComponent as TrainingIcon } from "../../../assets/images/training.svg";
// import { styles } from "./Recents.item.styles.ts";

interface Props {
  id: string;
  docId: string;
  type: string;
  title: string;
  createdAt: string;
}

const RecentsLineItem: React.FunctionComponent<Props> = ({
  id,
  docId,
  type,
  title,
  createdAt,
}) =>
// const classes = styles();

  (<ListItem key={id} button>
    <ListItemAvatar>
      <TrainingIcon />
    </ListItemAvatar>

    <ListItemText id={id} primary={`${docId} to ${title} . ${createdAt}`} />
  </ListItem>
  )
  ;
export default RecentsLineItem;
