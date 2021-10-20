import React, { useEffect, useState } from "react";
import Table from "src/components/Table";
import { useFetch } from "src/hooks";
import CreateDepartment from "./Create";
import DeleteDepartment from "./Delete";

export interface DepartmentData {
    id: number;
    name: string;
    numMembers: number;
    numRoles: number;
}
const Department: React.FC = () => {
    const [toBeDeleted, setToBeDeleted] = useState<DepartmentData[]>([]);
    const [openDeleteModal, setDeleteModalOpen] = useState(false);

    const { data, handleRefresh } = useFetch<DepartmentData[]>(
        "department",
        [],
        {
            method: "GET",
            credentials: "include",
        },
        "data"
    );

    const handleDelete = (
        selected: readonly DepartmentData[keyof DepartmentData][]
    ): void => {
        const newSelected: DepartmentData[] = [];

        for (const name of selected) {
            const found = data.find((d) => d.name === name);
            if (found) newSelected.push(found);
            else console.error(name + " not found");
        }

        setToBeDeleted(newSelected);
    };

    useEffect(() => {
        const handleOpenDelete = () => setDeleteModalOpen(true);
        const handleCloseDelete = () => setDeleteModalOpen(false);
        if (toBeDeleted.length > 0) handleOpenDelete();
        else handleCloseDelete();
    }, [toBeDeleted]);

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
            <DeleteDepartment
                selected={toBeDeleted}
                open={openDeleteModal}
                onClose={() => {
                    setToBeDeleted([]);
                }}
                onCancel={() => {
                    setToBeDeleted([]);
                }}
            />
            <Table
                onDelete={handleDelete}
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
