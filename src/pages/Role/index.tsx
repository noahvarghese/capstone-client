import Table from "../../components/Table";
import React, { useState } from "react";
import { useFetch } from "../../hooks";
import CreateRole from "./Create";
import { Button } from "@mui/material";

const Role: React.FC = () => {
    const [openCreateModal, setCreateModalOpen] = useState(false);
    const handleOpenCreate = () => setCreateModalOpen(true);
    const handleCloseCreate = () => setCreateModalOpen(false);
    const { data } = useFetch<
        { name: string; department: string; numMembers: number }[]
    >("role", [], { method: "GET", credentials: "include" }, "data");
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "4rem",
                marginTop: "5rem",
            }}
        >
            <Button type="button" onClick={handleOpenCreate}>
                Create Role
            </Button>
            <CreateRole open={openCreateModal} onClose={handleCloseCreate} />
            <Table
                style={{
                    maxWidth: "95vw",
                    width: "75rem",
                }}
                rows={data}
                title="Role"
                columns={[
                    {
                        id: "name",
                        label: "name",
                    },
                    {
                        id: "department",
                        label: "department",
                    },
                    { id: "numMembers", label: "number of members" },
                ]}
                columnOrder={["name", "department", "numMembers"]}
            />
        </div>
    );
};

export default Role;
