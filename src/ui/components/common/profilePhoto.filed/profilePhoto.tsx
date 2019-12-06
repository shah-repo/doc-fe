import { Box, Link } from "@material-ui/core";
import React from "react";

export const ProfilePhotoUpload: React.FunctionComponent = () => {

    const handleUpload = (file: File) => {
        console.log(file);
    };

    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files![0];
        handleUpload(file);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
        >
            <input
                accept="image/png, image/jpeg"
                id={"profilePhoto"}
                type="file"
                style={{display: "none"}}
                onChange={onChange}
            />
            <label htmlFor={"profilePhoto"}>
            <Link component="span" variant="button">
                upload photo
            </Link>
            </label>
        </Box>
    );
};

export default ProfilePhotoUpload;
