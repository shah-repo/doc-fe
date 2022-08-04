import { Typography } from "@material-ui/core";
import React from "react";
import HelpCenterVideoItem from "./components/HelpCenterVideoItem/HelpCenterVideoItem";
import HelpCenterWorkflowItem from "./components/HelpCenterWorkflowItem/HelpCenterWorkflowItem";

const items = {
  VIDEO: HelpCenterVideoItem,
  WORKFLOW: HelpCenterWorkflowItem,
};

const HelpCenterItem: React.FC<{title: string; type: string}> = (props) => {
  const Item = items[props.type];
  return <Item {...props} />;
};

const HelpCenterList: React.FC<{ content: any }> = ({ content }) => (
  <>
    <Typography variant="h6">{content.title}</Typography>
    {content.items.map((item) => <HelpCenterItem {...item} key={item.title} />)}
  </>
);

export default HelpCenterList;
