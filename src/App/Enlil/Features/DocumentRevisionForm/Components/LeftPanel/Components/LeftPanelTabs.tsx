import { Box, Tab, Tabs } from "@material-ui/core";
import React from "react";
import styles from "./LeftPanelTabs.styles";

// TODO: ENABLE FOR PANEL
// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: any;
//   value: any;
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`left-tabpanel-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box p={3}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

const LeftPanelTabs: React.FunctionComponent = () => {
  const [value, setAlignment] = React.useState(0);
  const classes = styles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setAlignment(newValue);
  };
  return (
    <Box className={
      `${classes.root} ${classes.outerContainer} `
    }>
      <Tabs value={value}  onChange={handleChange} TabIndicatorProps={{
        style: {
          display: "none",
        },
      }} >
        <Tab label="Field Config" disableRipple id= "left-side-0"
          className={`${classes.fieldConfig} ${classes.leftPanelTab}` + (value === 0 ? ` ${classes.activeTab}`
            : `${classes.inActiveTab}`)}
        />
        <Tab label="Set Rules" disableRipple id= "left-side-1"
          className={`${classes.setRule} ${classes.leftPanelTab}` + (value === 1 ? ` ${classes.activeTab}`
            : `${classes.inActiveTab}`)}
        />
      </Tabs>
      {/*  TODO: ENABLE FOR PANEL */}
      {/* <TabPanel value={value} index={0}>
        Field Config
      </TabPanel>
      <TabPanel value={value} index={1}>
        Set Rules
      </TabPanel> */}
    </Box>
  );
};

export default LeftPanelTabs;
