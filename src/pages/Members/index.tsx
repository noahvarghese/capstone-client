import { Box } from "@mui/material";
import React from "react";
import MemberInvite from "./Invite";
import View from "./View";
import { useFetch, useModalWithProps } from "src/hooks";
import MemberDelete from "./Delete";
import { useHistory } from "react-router";

export interface MemberData {
    name: string;
    email: string;
    phone: string;
    birthday: Date | string | null;
    id: number;
}

const Members: React.FC = () => {
    const history = useHistory();
    const { data, handleRefresh } = useFetch<MemberData[]>(
        "member",
        [],
        {
            method: "GET",
            credentials: "include",
        },
        "data"
    );
    const { open, handleClose, handleOpen, selected } =
        useModalWithProps<MemberData>("email", data);

    const handleEdit = (selected: MemberData[keyof MemberData]): void => {
        const found = data.find((d) => d.email === selected);
        if (found) history.push("/member/" + found.id);
    };

    return (
        <Box
            className="Members"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "4rem",
                marginTop: "5rem",
            }}
        >
            <View
                handleRefresh={handleRefresh}
                onDelete={handleOpen}
                onEdit={handleEdit}
                data={data}
                style={{
                    maxWidth: "95vw",
                    width: "75rem",
                }}
                toolBarItems={[<MemberInvite key="invite" />]}
            />
            <MemberDelete
                selected={selected}
                open={open}
                onClose={handleClose}
                onCancel={handleClose}
            />
        </Box>
    );
};

export default Members;
