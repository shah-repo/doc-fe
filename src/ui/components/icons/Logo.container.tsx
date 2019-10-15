import React from "react";
import { useSelector } from "react-redux";
import { companySelectors } from "../../../state/ducks/company";
import Logo from "./Logo.presenter";

const LogoContainer: React.FunctionComponent = () => {
  const whiteLabeling = useSelector(companySelectors.getWhiteLabeling);

  if (whiteLabeling.logo) {
    return (
      <img
        src={whiteLabeling.logo}
        style={{ maxWidth: "100%" }}
      />
    );
  }

  return <Logo />;
};

export default LogoContainer;
