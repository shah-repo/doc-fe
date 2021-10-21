import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as FMIcon } from "../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../assets/images/MPI.svg";
import { ReactComponent as POIcon } from "../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../assets/images/SOP.svg";
import { styles } from "./Recents.item.styles";
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
}) => {
  const classes = styles();
  const titleRender = (type, docId, title, createdAt) => (
    <Typography display="inline" className={classes.titletext}>
      {`${docId} `}
      {type === "PO" && <span> to </span>}
      <b>
        {/* {truncate(`${title}`, {
          length: 30,
          separator: "...",
        })}{" "} */}
        {title}
        &#46;
      </b>
      <small>{` ${createdAt}`}</small>
    </Typography>
  );
  return (
    <ListItem key={id} button className={classes.listitem}>
      <ListItemIcon>
        <>
          {type === "PO" && <POIcon />}
          {type === "MPI" && <MPIIcon />}
          {type === "FM" && <FMIcon />}
          {type === "SOP" && <SOPIcon />}
        </>
      </ListItemIcon>
      <ListItemText
        id={id}
        primary={titleRender(type, docId, title, createdAt)}
      />
    </ListItem>
  );
};

export default RecentsLineItem;
