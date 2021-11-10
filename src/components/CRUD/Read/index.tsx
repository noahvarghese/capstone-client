import React from "react";
import Table from "src/components/Table";
import { Column } from "src/components/Table/Head";

export interface ReadProps<T> {
    columnOrder: (keyof T)[];
    columns: Column<T>[];
}

interface ReadTableProps<T> {
    isRefreshing: boolean;
    name: string;
    setSelected: (t: T[]) => void;
    selected: T[];
    primaryField: keyof T;
    handleSelect: (e: React.MouseEvent<unknown>, t: T[keyof T]) => void;
    _create: React.ReactElement;
    _delete: React.ReactElement;
    _edit: React.ReactElement;
    data: T[];
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSelected: (t: T[keyof T]) => boolean;
}

const Read = <T,>({
    name,
    data,
    isRefreshing,
    ...props
}: ReadProps<T> & ReadTableProps<T>) => (
    <Table
        {...props}
        rows={isRefreshing ? [] : data}
        title={name}
        style={{
            maxWidth: "95vw",
            width: "75rem",
        }}
    />
);

export default Read;
