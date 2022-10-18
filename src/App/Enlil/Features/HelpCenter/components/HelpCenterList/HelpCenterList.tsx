import { Box, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Text from "../../../../../../ui/components/Text";
import { HelpCenterItems, HelpCenterItemType, HelpCenterModuleData } from "../../HelpCenter.types";
import HelpCenterExternalLink from "../HelpCenterExternalLink/HelpCenterExternalLink";
import HelpCenterOutLink from "../HelpCenterOutLink/HelpCenterOutLink";
import HelpCenterHowToItem from "./components/HelpCenterHowToItem/HelpCenterHowToItem";
import HelpCenterVideoItem from "./components/HelpCenterVideoItem/HelpCenterVideoItem";
import HelpCenterWorkflowItem from "./components/HelpCenterWorkflowItem/HelpCenterWorkflowItem";
import useStyles from "./HelpCenterList.styles";

const items = {
  [HelpCenterItemType.Video]: HelpCenterVideoItem,
  [HelpCenterItemType.HowTo]: HelpCenterHowToItem,
  [HelpCenterItemType.Workflow]: HelpCenterWorkflowItem,
};

interface Props {
  content: HelpCenterModuleData;
}

const HelpCenterItem: React.FC<HelpCenterItems> = (props) => {
  const Item = items[props.type] as React.FC;
  return <Item {...props} />;
};

const HelpCenterList: React.FC<Props> = ({ content }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h4" data-cy="help-center.content-title">
        {content.title}
        {content.url && (
          <HelpCenterExternalLink
            className={classes.link}
            to={content.url}
            component={Link}
          >
            <HelpCenterOutLink>
              <Text translation="help.view.full.guide" />
            </HelpCenterOutLink>
          </HelpCenterExternalLink>
        )}
      </Typography>
      <Box className={classes.list}>
        {content.items.map((item) => <HelpCenterItem {...item} key={item.url} />)}
      </Box>
    </Box>
  );
};

export default HelpCenterList;
