import { Box, Paper } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import { useFetch } from "src/hooks";

const EditMember: React.FC = () => {
    const params = useParams<{ id?: string | undefined }>();
    const id = Number(params.id);

    const { data, handleRefresh, refreshing } = useFetch("member/" + id, {
        method: "GET",
        credentials: "include",
    });

    return (
        <Box>
            <Paper></Paper>
        </Box>
    );
};

export default EditMember;
