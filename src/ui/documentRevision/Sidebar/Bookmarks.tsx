import { Button, withStyles, WithStyles } from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import copy from "copy-to-clipboard";
import React from "react";
import { Link } from "react-router-dom";
import { FBSchemaProps } from "../../form.builder/FBSchema/FBSchema.types";
import styles from "../styles";

interface Props {
  location: Location;
  fbTemplate: FBSchemaProps[];
}

export type SidebarPresenterProps = Props & WithStyles<typeof styles>;

export const Bookmarks: React.FunctionComponent<SidebarPresenterProps> = ({ location, fbTemplate }) => {
  const links =  fbTemplate.map((schema) => {
    const link = window.location.href.split("#");
    if (schema.type === "section") {
      return (
        <Link
          style={{ textDecoration: "none" }}
          to={{
            hash: schema.label?.toString().replace(/\s/g, ""),
          }}
          key={schema.index}>
          <div
            style={{ paddingLeft: 13, paddingTop: 8, paddingBottom: 8, color: "black", width: "100%" }}>
            {schema.label}
            <Button
              onClick={() => copy(`${link[0]}#${schema.label?.toString().replace(/\s/g, "")}`)}
              style={{ padding: 0, margin: 0, backgroundColor: "transparent", float: "right"  }}
            >
              <FileCopyOutlinedIcon fontSize="small" color="primary" />
            </Button>
          </div>
        </Link>
      );
    }
  });
  return (
    <div>{links}</div>
  );
};

export default withStyles(styles)(Bookmarks);
