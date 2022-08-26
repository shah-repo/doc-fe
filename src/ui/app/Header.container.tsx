import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SM } from "../../App";
import { authActions, authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import useGetHasTag from "../hooks/useGetHasTag";
import HeaderPresenter from "./Header.presenter";

const HeaderContainer: React.FC = () => {
  const fullHeight = SM.isHomeURL;
  const name = useSelector(authSelectors.currentUserName);
  const canToggleCustomLabels = useGetHasTag(GroupTag.LABEL_TOOLTIPS);
  const customLabelsValue = useSelector(authSelectors.isCustomLabelsOn);
  const dispatch = useDispatch();
  const toggleCustomLabels = () => {
    dispatch(authActions.toggleCustomLabels(!customLabelsValue));
  };

  return (
    <HeaderPresenter
      {...{
        name,
        fullHeight,
        customLabelsValue,
        toggleCustomLabels,
        canToggleCustomLabels,
      }}
    />
  );
};

export default HeaderContainer;
