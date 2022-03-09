import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";

const ToggleButtonLeft: React.FunctionComponent = () => {
  const [alignment, setAlignment] = React.useState("setRules");

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
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "12px 24px",
            position: "absolute",
            width: "138px",
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
          }}
        >
          Field Config
        </ToggleButton>

        <ToggleButton
          value="setRules1"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // padding: "12px 24px",
            position: "absolute",
            width: "115px",
            height: "42px",
            top: "5px",
            left: "146px",
            border: 0,
            // background: "red",
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

export default ToggleButtonLeft;
