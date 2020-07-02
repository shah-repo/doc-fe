import { Box, Button, createStyles, makeStyles, Theme, Tooltip } from "@material-ui/core";
import copy from "copy-to-clipboard";
import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as CopyIcon } from "../../../assets/images/copy_outlined.svg";
import Text from "../../components/Text";
import { FBSchemaProps } from "../../form.builder/FBSchema/FBSchema.types";
import Colors from "../../layout/theme/utils/colors";

interface SidebarPresenterProps {
  location: Location;
  schema: FBSchemaProps[] | undefined;
}

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      textDecoration: "none",
    },
    item: ({ isCurrentBookmark }) => ({
      color: Colors.black,
      width: "100%",
      fontWeight: isCurrentBookmark ? 700 : 100,
      padding: theme.spacing(1, 2),
      paddingRight: theme.spacing(1),
    }),
    button: {
      "padding": 0,
      "margin": 0,
      "backgroundColor": "transparent",
      "float": "right",
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  }));

export const Bookmarks: React.FunctionComponent<SidebarPresenterProps> = ({ location, schema }) => {
  if (!schema) {
    return null;
  }
  const links =  schema.map((schema) => {
    if (schema.type === "section") {
      const hash = schema.label?.toString().replace(/\s/g, "");
      const link = window.location.href.split("#");
      const isCurrentBookmark = hash === link[1];
      const classes = styles({ isCurrentBookmark });

      return (
        <Link
          className={classes.link}
          to={{ hash }}
          key={schema.index}>
          <Box className={classes.item}>
            {schema.label}
            <Button
              onClick={() => copy(`${link[0]}#${hash}`)}
              className={classes.button}
            >
              <Tooltip arrow title={<Text translation={"common.copy.link"}/>} placement="top">
                <CopyIcon/>
              </Tooltip>
            </Button>
          </Box>
        </Link>
      );
    }
  });
  return (
    <Box>{links}</Box>
  );
};

export default Bookmarks;
