import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import MemberInvite from "./Invite";
import View from "./View";
import { useFetch } from "src/hooks";
import MemberDelete from "./Delete";

export interface MemberData {
    name: string;
    email: string;
    phone: string;
    birthday: Date | null;
    id: number;
}

const Members: React.FC = () => {
    const [toBeDeleted, setToBeDeleted] = useState<MemberData[]>([]);
    const [openDeleteModal, setDeleteModalOpen] = useState(false);

    const [openInviteModal, setInviteModalOpen] = useState(false);
    const handleOpenInvite = () => setInviteModalOpen(true);
    const handleCloseInvite = () => setInviteModalOpen(false);

    const handleSelectedChanged = (
        selected: readonly MemberData[keyof MemberData][]
    ): void => {
        const newSelected: MemberData[] = [];

        for (const email of selected) {
            const found = data.find((d) => d.email === email);
            if (found) newSelected.push(found);
            else console.error(email + " not found");
        }

        setToBeDeleted(newSelected);
    };

    const data = useFetch<MemberData>(
        "member",
        {
            method: "GET",
            credentials: "include",
        },
        "data"
    );

    useEffect(() => {
        const handleOpenDelete = () => setDeleteModalOpen(true);
        const handleCloseDelete = () => setDeleteModalOpen(false);
        if (toBeDeleted.length > 0) handleOpenDelete();
        else handleCloseDelete();
    }, [toBeDeleted]);

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
                onDelete={handleSelectedChanged}
                data={data}
                style={{
                    maxWidth: "95vw",
                    width: "75rem",
                }}
                toolBarItems={[
                    <Button
                        key="invite"
                        type="button"
                        variant="contained"
                        onClick={handleOpenInvite}
                    >
                        Invite
                    </Button>,
                ]}
            />
            <MemberDelete
                selected={toBeDeleted}
                open={openDeleteModal}
                onClose={() => {
                    setToBeDeleted([]);
                }}
                onCancel={() => {
                    setToBeDeleted([]);
                }}
            />
            <MemberInvite open={openInviteModal} onClose={handleCloseInvite} />
        </Box>
    );
};

export default Members;
