import React from "react";
// import Table from "src/components/Table";
// import { useFetch, useModalWithProps } from "src/hooks";
// import CreateDepartment from "./Create";
// import DeleteDepartment from "./Delete";

export interface DepartmentData {
    id: number;
    name: string;
    numMembers: number;
    numRoles: number;
}
const Department: React.FC = () => {
    // const { data, handleRefresh } = useFetch<DepartmentData[]>(
    //     "department",
    //     [],
    //     {
    //         method: "GET",
    //         credentials: "include",
    //     },
    //     "data"
    // );
    // const { open, handleOpen, handleClose, selected } =
    //     useModalWithProps<DepartmentData>("name", data);

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
            {/* <CreateDepartment />
            <DeleteDepartment
                selected={selected}
                open={open}
                onClose={handleClose}
                onCancel={handleClose}
            />
            <Table
                onDelete={handleOpen}
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
            /> */}
        </div>
    );
};

export default Department;
