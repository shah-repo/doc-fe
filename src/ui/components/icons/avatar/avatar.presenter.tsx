import React from "react";

interface OwnProps {
    src: string;
}

type Props = OwnProps;

const AvatarPresenter: React.FunctionComponent<Props> = ({ src }) => {

  return (
    <div
        style={{
            border: `8px solid ${"#76608D"}`,
            width: "213px",
            height: "213px",
            borderRadius: "50%",
            zIndex: 9999,
            backgroundColor: "white",
        }}
    >
        <img
            src={src}
            style={{ width: "196px", height: "196px" }}
            alt="Profile photo"
        />
    </div>
  );
};

export default AvatarPresenter;
