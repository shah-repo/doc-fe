import { Box } from "@material-ui/core";
import React from "react";

interface OwnProps {
    src: string;
}

type Props = OwnProps;

const AvatarPresenter: React.FunctionComponent<Props> = ({ src }) => {

  return (
    <Box
        display="flex"
        justifyContent="center"
        mt={20}
    >
        <div
            style={{
                border: `8px solid ${"#76608D"}`,
                width: "213px",
                height: "213px",
                borderRadius: "50%",
                zIndex: 9999,
                backgroundColor: "#76608D",
            }}
        >
            <img
                src={src}
                style={{ width: "196px", height: "196px", borderRadius: "50%" }}
                alt="Profile photo"
            />
        </div>
    </Box>
  );
};

export default AvatarPresenter;
