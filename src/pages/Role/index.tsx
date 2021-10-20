import Table from "../../components/Table";
import React from "react";
import { useFetch } from "../../hooks";

const Role: React.FC = () => {
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
