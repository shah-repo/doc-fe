import { Typography } from "@material-ui/core";
import React from "react";
import { HelpCenterItemType, IHelpCenterModuleData } from "../../HelpCenter.types";
import HelpCenterVideoItem from "./components/HelpCenterVideoItem/HelpCenterVideoItem";
import HelpCenterWorkflowItem from "./components/HelpCenterWorkflowItem/HelpCenterWorkflowItem";

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

const HelpCenterList: React.FC<Props> = ({ content }) => (
  <>
    <Typography variant="h6">{content.title}</Typography>
    {content.items.map((item) => <HelpCenterItem {...item} key={item.title} />)}
  </>
);

export default HelpCenterList;
