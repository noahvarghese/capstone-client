import React from "react";
import Table from "src/components/Table";
import { useFetch } from "src/hooks";
import CreateDepartment from "./Create";

const Department: React.FC = () => {
    const { data, handleRefresh } = useFetch<
        { id: number; name: string; numMembers: number; numRoles: number }[]
    >(
        "department",
        [],
        {
            method: "GET",
            credentials: "include",
        },
        "data"
    );

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
            <CreateDepartment />
            <Table
                handleRefresh={handleRefresh}
                style={{
                    maxWidth: "95vw",
                    width: "75rem",
                }}
                rows={data}
                title="Departments"
                columns={[
                    {
                        id: "name",
                        label: "name",
                    },
                    {
                        id: "numMembers",
                        label: "number of members",
                    },
                    {
                        id: "numRoles",
                        label: "number of roles",
                    },
                ]}
                columnOrder={["name", "numMembers", "numRoles"]}
            />
        </div>
    );
};

export default Department;
