import React from "react";
import CRUD from "src/components/CRUD";
import { Column } from "src/components/Table/Head";
import { IconButton, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IFormElement } from "src/components/CRUD/Create";

export interface DepartmentData {
    id: number;
    name: string;
    numMembers: number;
    numRoles: number;
}

const columns: Column<DepartmentData>[] = [
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
];

const columnOrder: (keyof DepartmentData)[] = [
    "name",
    "numMembers",
    "numRoles",
];

const createFormElements: IFormElement[] = [
    {
        component: <TextField autoFocus type="text" />,
        params: { name: "name", options: { required: "name is required" } },
    },
];

const NAME = "departments";
const URL = `/${NAME}`;

const Department: React.FC = () => {
    return (
        <CRUD
            primaryField="id"
            name={NAME}
            url={URL}
            readProps={{ columns, columnOrder }}
            createProps={{
                buttons: ["Cancel", "Submit"],
                defaultValues: { name: "" },
                formElements: createFormElements,
                successMessage: "department created",
                title: "create department",
                trigger: "create",
                url: URL,
            }}
            deleteProps={{
                trigger: (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ),
                formatter: (s: DepartmentData) => <>{s.name}&nbsp;</>,
            }}
        />
    );
};

export default Department;
