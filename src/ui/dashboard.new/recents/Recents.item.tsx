import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as FMIcon } from "../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../assets/images/MPI.svg";
import { ReactComponent as CRIcon } from "../../../assets/images/pending_approval.svg";
import { ReactComponent as POIcon } from "../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../assets/images/SOP.svg";
import { styles } from "./Recents.item.styles";
interface Props {
  index: number;
  id: string;
  docId: string;
  type: string;
  title: string;
  accessedAt: string;
}

const RecentsLineItem: React.FunctionComponent<Props> = ({
  id,
  docId,
  type,
  title,
  accessedAt,
}) => {
  const classes = styles();
  const titleRender = (type, docId, title, accessedAt) => (
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
      <small>{` ${accessedAt}`}</small>
    </Typography>
  );
  return (
    <ListItem key={id} button className={classes.listitem}>
      <ListItemIcon>
        <>
          {type === "PO" && <POIcon />}
          {type === "MPI" && <MPIIcon />}
          {type === "FORM" && <FMIcon />}
          {type === "SUPPLIER" && <SOPIcon />}
          {(type === "CHANGE_REQUEST" || type === "DAM") && <CRIcon />}
        </>
      </ListItemIcon>
      <ListItemText
        id={id}
        primary={titleRender(type, docId, title, accessedAt)}
      />
    </ListItem>
  );
};

export default RecentsLineItem;
