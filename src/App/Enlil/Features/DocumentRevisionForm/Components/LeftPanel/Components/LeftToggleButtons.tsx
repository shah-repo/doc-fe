import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React from "react";
// import styles from "./LeftToggleButtons.styles";
import Text from "../../../../../../../ui/components/Text";
import { FBEditorTitleProps } from "../../../../../../../ui/form.builder/FBEditorTitle/FBEditorTitle.types";

const LeftToggleButtons: React.FunctionComponent<FBEditorTitleProps> = ({
  mode,
  handleMode,
}) =>
  (
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
        exclusive
        style={{
          position: "absolute",
        }}
      >
        <ToggleButton
          value={mode}
          disableFocusRipple
          disableRipple
          onClick={handleMode}
          // TODO update with classes
          style={mode === "config" ? {
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
            left: "14.5px",
            border: 0,
            color: "#767B87",
            fontFamily: "Sora",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "18px",
          }}
        >
          <Text translation= "form.builder.field.config" />
        </ToggleButton>
        <ToggleButton
          value={mode}
          disableFocusRipple
          disableRipple
          onClick={handleMode}
          style={mode === "validation" ? {
            textTransform: "none",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "12px 24px",
            position: "absolute",
            width: "122px",
            height: "42px",
            left: "145px",
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
            left: "153px",
            border: 0,
            color: "#767B87",
            fontFamily: "Sora",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "18px",
          }}
        >
          <Text translation= "form.builder.validation" />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
;

export default LeftToggleButtons;
