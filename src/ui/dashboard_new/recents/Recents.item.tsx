import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { truncate } from "lodash";
import React from "react";
import { ReactComponent as FMIcon } from "../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../assets/images/MPI.svg";
import { ReactComponent as POIcon } from "../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../assets/images/SOP.svg";
// import { styles } from "./Recents.styles";
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
  // const classes = styles();
  const titleRender = (type, docId, title, createdAt) => (
    <div>
      {`${docId} `}
      {type === "PO" && <span> to </span>}
      <strong>
        {truncate(`${title}`, {
          length: 30,
          separator: "...",
        })}
        .
      </strong>{" "}
      <small>{createdAt}</small>
    </div>
  );
  return (
    <ListItem key={id} button>
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
