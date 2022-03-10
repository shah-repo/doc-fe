import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
// import styles from "./LeftToggleButtons.styles";

const LeftToggleButtons: React.FunctionComponent = () => {
  const [alignment, setAlignment] = React.useState("fieldConfig");
  // const classes = styles();
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };
  return (
    <div
      style={{
        // position: "absolute",
        width: "270px",
        height: "52px",
        // left: "10px",
        // top: "64px",
        background: "#EBEDF2",
        borderRadius: "100px",
      }}
    >
      <ToggleButtonGroup
        color="primary"
        // it will return string
        exclusive
        value={alignment}
        onChange={handleChange}
        style={{
          position: "absolute",
        }}
      >
        <ToggleButton
          value="fieldConfig"
          disableFocusRipple
          disableRipple
          // TODO update with classes
          style={alignment === "fieldConfig" ? {
            textTransform: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "12px 24px",
            position: "absolute",
            width: "143px",
            height: "42px",
            left: "5px",
            top: "5px",
            background: "#FFFFFF",
            boxShadow: "0px 2px 5px rgba(204, 212, 217, 0.8)",
            borderRadius: "100px",
            color: "#011FBB",
            fontFamily: "Sora",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "18px",
          } : {
            textTransform: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            width: "123px",
            height: "42px",
            top: "5px",
            left: "5px",
            border: 0,
            color: "#767B87",
            fontFamily: "Sora",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "18px",
          }}
        >
          Field Config
        </ToggleButton>

        <ToggleButton
          value="setRules"
          disableFocusRipple
          disableRipple
          style={alignment === "setRules" ? {
            textTransform: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "12px 24px",
            position: "absolute",
            width: "122px",
            height: "42px",
            left: "150px",
            top: "5px",
            background: "#FFFFFF",
            boxShadow: "0px 2px 5px rgba(204, 212, 217, 0.8)",
            borderRadius: "100px",
            color: "#011FBB",
            fontFamily: "Sora",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "18px",
          } : {
            textTransform: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            width: "105px",
            height: "42px",
            top: "5px",
            left: "150px",
            border: 0,
            color: "#767B87",
            fontFamily: "Sora",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "18px",
          }}
        >
          Set Rules
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default LeftToggleButtons;
