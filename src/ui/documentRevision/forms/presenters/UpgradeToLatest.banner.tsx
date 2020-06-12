import React from "react";

interface Props {
  showShouldUpgrade: boolean;
  onUpgradeClick: () => void;
}

export const UpgradeToLatestBanner: React.FunctionComponent<Props> = ({
  showShouldUpgrade,
  onUpgradeClick,
}) => {
  console.log(onUpgradeClick);

  return (
    <>
      {
        showShouldUpgrade &&
        <div>Banner</div>
      }
    </>
  );
};

export default UpgradeToLatestBanner;
