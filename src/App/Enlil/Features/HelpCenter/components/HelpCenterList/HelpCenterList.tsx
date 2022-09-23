import { Box, Typography } from "@material-ui/core";
import React from "react";
import { HelpCenterItemType, IHelpCenterModuleData } from "../../HelpCenter.types";
import HelpCenterVideoItem from "./components/HelpCenterVideoItem/HelpCenterVideoItem";
import HelpCenterWorkflowItem from "./components/HelpCenterWorkflowItem/HelpCenterWorkflowItem";
import useStyles from "./HelpCenterList.styles";

const items = {
  [HelpCenterItemType.Video]: HelpCenterVideoItem,
  [HelpCenterItemType.Workflow]: HelpCenterWorkflowItem,
};

interface Props {
  content: IHelpCenterModuleData;
}

function HelpCenterItem(props) {
  const Item = items[props.type];
  return <Item {...props} />;
}

const HelpCenterList: React.FC<Props> = ({ content }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h4">{content.title}</Typography>
      <Box className={classes.list}>
        {content.items.map((item) => <HelpCenterItem {...item} key={item.title} />)}
      </Box>
    </Box>
  );
};

export default HelpCenterList;
