import Table from "../../components/Table";
import React from "react";
import { useFetch, useModalWithProps } from "../../hooks";
import CreateRole from "./Create";
import DeleteRole from "./Delete";

export interface RoleData {
    id: number;
    name: string;
    department: string;
    numMembers: number;
}

const Role: React.FC = () => {
    const { data, handleRefresh } = useFetch<RoleData[]>(
        "role",
        [],
        { method: "GET", credentials: "include" },
        "data"
    );
    const { open, handleOpen, selected, handleClose } =
        // the field needs to be changed so it is unique
        // or fix table so it passes the id instead
        useModalWithProps<RoleData>("name", data);

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
            <DeleteRole
                selected={selected}
                open={open}
                onCancel={handleClose}
                onClose={handleClose}
            />
            <Table
                onDelete={handleOpen}
                handleRefresh={handleRefresh}
                style={{
                    maxWidth: "95vw",
                    width: "75rem",
                }}
                rows={data}
                title="Role"
                toolBarItems={[<CreateRole key="create" />]}
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
