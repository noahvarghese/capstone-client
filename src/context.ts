import React from "react";

export type Business = {
    id: number;
    name: string;
    default: boolean;
    selected: boolean;
};

export type Department = {
    id: number;
    name: string;
    num_roles: number;
    num_managers: number;
    num_members: number;
};

export type Role = {
    id: number;
    num_members: number;
    name: string;
    access: "ADMIN" | "MANAGER" | "USER";
    department: Department;
};

export type Member = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    birthday: Date | null;
    phone: string;
    accepted: boolean;
    roles: Role[];
};

const AppContext = React.createContext<{
    userId: number | undefined;
    setUserId: (id: number | undefined) => void;
    businesses: Business[];
    setBusinesses: (businesses: Business[]) => void;
    roles: Role[];
    setRoles: (roles: Role[]) => void;
    logout: () => void;
}>({
    userId: undefined,
    setUserId: (_: number | undefined) => {},
    businesses: [],
    setBusinesses: (_: Business[]) => {},
    roles: [],
    setRoles: (_: Role[]) => {},
    logout: () => {},
});

export default AppContext;
