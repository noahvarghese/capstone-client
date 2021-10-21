import { IconButton, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import CRUD from "src/components/CRUD";
import { emailValidator, phoneValidator } from "src/util/validators";
import { Column } from "src/components/Table/Head";

const NAME = "members";
const URL = `/${NAME}`;

export interface MemberData {
    name: string;
    email: string;
    phone: string;
    birthday: Date | string | null;
    id: number;
}

const columns: Column<MemberData>[] = [
    {
        id: "email",
        label: "email",
    },
    {
        id: "name",
        label: "name",
    },
    {
        id: "birthday",
        label: "birthday",
    },
    {
        id: "phone",
        label: "phone",
    },
];
const columnOrder: (keyof MemberData)[] = [
    "email",
    "name",
    "birthday",
    "phone",
];

const createFormElements = [
    {
        component: (
            <TextField autoFocus autoComplete="given-name" type="text" />
        ),
        params: {
            name: "first_name",
            options: { required: "first name cannot be empty" },
        },
    },
    {
        component: <TextField autoComplete="family-name" type="text" />,
        params: {
            name: "last_name",
            options: {
                required: "last name cannot be empty",
            },
        },
    },
    {
        component: <TextField autoComplete="email" type="email" />,
        params: {
            name: "email",
            options: {
                required: "email cannot be empty",
                validate: emailValidator,
            },
        },
    },
    {
        component: <TextField autoComplete="tel" type="tel" />,
        params: {
            name: "phone",
            options: {
                required: "phone cannot be empty",
                validate: phoneValidator,
            },
        },
    },
];

const Member: React.FC = () => {
    return (
        <CRUD
            primaryField="id"
            name={NAME}
            url={URL}
            readProps={{
                columns,
                columnOrder,
            }}
            createProps={{
                buttons: ["No thanks", "Send Invite"],
                defaultValues: {
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                },
                formElements: createFormElements,
                successMessage: "invite sent",
                title: "Invite",
                trigger: "invite",
                url: "member/invite",
                text: "The user will be notified by email",
            }}
            deleteProps={{
                trigger: (
                    <Tooltip title="Delete">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ),
                formatter: (s: MemberData) => (
                    <>
                        {s.name} &lt;{s.email}&gt;&nbsp;
                    </>
                ),
            }}
        />
    );
};

export default Member;
