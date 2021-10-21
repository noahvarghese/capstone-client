import {
    Checkbox,
    IconButton,
    MenuItem,
    TextField,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { Column } from "src/components/Table/Head";
import { IFormElement } from "src/components/CRUD/Create";
import { useFetch } from "src/hooks";
import CRUD from "src/components/CRUD";

export interface RoleData {
    id: number;
    name: string;
    department: string;
    numMembers: number;
}

const NAME = "roles";
const URL = "/roles";

const columns: Column<RoleData>[] = [
    {
        id: "name",
        label: "name",
    },
    {
        id: "department",
        label: "department",
    },
    { id: "numMembers", label: "number of members" },
];

const columnOrder: (keyof RoleData)[] = ["name", "department", "numMembers"];

const Role: React.FC = () => {
    const { data: departments } = useFetch<
        { id: number; name: string; numMembers: number; numRoles: number }[]
    >(
        "departments",
        [],
        {
            method: "GET",
            credentials: "include",
        },
        "data"
    );

    const createFormElements: (
        | IFormElement
        | {
              legend: string;
              formElements: IFormElement[];
          }
    )[] = [
        {
            component: <TextField autoFocus />,
            params: {
                name: "name",
                options: {
                    required: "name cannot be empty",
                },
            },
        },
        {
            component: (
                <TextField select>
                    {departments
                        .map((d) => (
                            <MenuItem value={d.id} key={d.name}>
                                {d.name}
                            </MenuItem>
                        ))
                        .concat([
                            <MenuItem value={0} key="default"></MenuItem>,
                        ])}
                </TextField>
            ),
            params: {
                name: "department",
                options: { required: "department cannot be empty" },
            },
        },
        {
            legend: "Permissions",
            formElements: [
                {
                    component: <Checkbox />,
                    params: { name: "global_crud_users" },
                    label: "CRUD users",
                },
                {
                    component: <Checkbox />,
                    params: { name: "global_crud_departments" },
                    label: "CRUD departments",
                },
                {
                    component: <Checkbox />,
                    params: { name: "global_crud_roles" },
                    label: "CRUD roles",
                },
                {
                    component: <Checkbox />,
                    params: { name: "global_crud_resources" },
                    label: "CRUD resources",
                },
                {
                    component: <Checkbox />,
                    params: {
                        name: "global_assign_users_to_departments",
                    },
                    label: "Assign users to departments",
                },
                {
                    component: <Checkbox />,
                    params: {
                        name: "global_assign_users_to_roles",
                    },
                    label: "Assign users to roles",
                },
                {
                    component: <Checkbox />,
                    params: {
                        name: "global_assign_resources_to_departments",
                    },
                    label: "Assign resources to departments",
                },
                {
                    component: <Checkbox />,
                    params: {
                        name: "global_assign_resources_to_roles",
                    },
                    label: "Assign resources to roles",
                },
                {
                    component: <Checkbox />,
                    params: {
                        name: "view_reports",
                    },
                    label: "View reports",
                },
                {
                    component: <Checkbox />,
                    params: { name: "dept_crud_roles" },
                    label: "CRUD roles within department",
                },
                {
                    component: <Checkbox />,
                    params: { name: "dept_crud_resources" },
                    label: "CRUD resources within department",
                },
                {
                    component: <Checkbox />,
                    params: { name: "dept_assign_users_to_roles" },
                    label: "Assign users to roles within department",
                },
                {
                    component: <Checkbox />,
                    params: { name: "dept_assign_resources_to_roles" },
                    label: "Assign resources to roles within department",
                },
            ],
        },
    ];

    return (
        <CRUD
            primaryField="id"
            name={NAME}
            url={URL}
            readProps={{ columns, columnOrder }}
            createProps={{
                buttons: ["Cancel", "Create"],
                defaultValues: {
                    department: 0,
                    name: "",
                    global_crud_users: false,
                    global_crud_departments: false,
                    global_crud_roles: false,
                    global_crud_resources: false,
                    global_assign_users_to_departments: false,
                    global_assign_users_to_roles: false,
                    global_assign_resources_to_departments: false,
                    global_assign_resources_to_roles: false,
                    global_view_reports: false,
                    dept_crud_roles: false,
                    dept_crud_resources: false,
                    dept_assign_users_to_roles: false,
                    dept_assign_resources_to_roles: false,
                },
                formElements: createFormElements,
                successMessage: "role created",
                title: "Create Role",
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
                formatter: (s) => <>{s.name}&nbsp;</>,
            }}
        />
    );
};

export default Role;
