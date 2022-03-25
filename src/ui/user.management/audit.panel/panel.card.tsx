import { Box } from "@material-ui/core";
import React from "react";
import DetailDescription from "./detail.description";
import styles from "./styles";
import UserAvatar from "./userAvatar";

const PanelCard: React.FunctionComponent<any> = () => {
  const classes = styles();
  const renderComponentType = () => (
    // Update Conditional rendering base on response
    ["1", "2", "3", "4"].map((text, index) => (
      <Box
        key={index}
        width={300} fontFamily="Sora"
        className={classes.outerContainer}
      >
        <Box display="grid">
          <UserAvatar/>
          <DetailDescription text={text} marginBottom={true} />
          {(index === 1 || index === 3) && <DetailDescription text={text} multitypo = {index === 3}/>}
        </Box>
      </Box>
    )) );


  return (<>
    {renderComponentType()}
  </>);
};

export default PanelCard;
