import React from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../state/ducks/company";
import Text from "../Text";

const BottomLogoContainer: React.FunctionComponent = () => {
  const whiteLabeling = useSelector(companySelectors.getWhiteLabeling);

  if (!whiteLabeling.logo) {
    return null;
  }

  return (
    <div
      style={{
        bottom: 30,
        position: "absolute",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        color: "white",
        letterSpacing: 1,
        fontWeight: 100,
      }}
    >
      <Text translation="common.powered.by" />
      <img
        src="https://cdn.worldvectorlogo.com/logos/apple-music.svg"
        style={{
          width: "30%",
          marginLeft: 10,
        }}
      />
    </div>
  );
};

export default BottomLogoContainer;
