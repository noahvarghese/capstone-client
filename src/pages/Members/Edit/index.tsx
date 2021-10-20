import { Box, IconButton, Paper, TextField } from "@mui/material";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import React from "react";
import { useParams } from "react-router";
import { useFetch } from "src/hooks";

const EditMember: React.FC = () => {
    const params = useParams<{ id?: string | undefined }>();
    const id = Number(params.id);

    const res = useFetch(
        "member/" + id,
        {},
        {
            method: "GET",
            credentials: "include",
        }
    );
    console.log(res);

    return (
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                marginTop: "4rem",
            }}
        >
            <Paper style={{ maxWidth: "95vw", width: "40rem" }}>
                <IconButton style={{ height: "5rem", width: "5rem" }}>
                    <AccountCircleTwoToneIcon
                        style={{ height: "100%", width: "100%" }}
                    />
                </IconButton>
                <form>
                    <TextField />
                </form>
            </Paper>
        </Box>
    );
};

export default EditMember;
