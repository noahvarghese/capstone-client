import {
    Box,
    Checkbox,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import React from "react";

export interface Column<T> {
    id: keyof T;
    label: string;
}

interface TableHeadProps<T> {
    numSelected: number;
    rowCount: number;
    order: "asc" | "desc";
    orderBy: string;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof T
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    columns: Column<T>[];
}

const Head = <T,>({
    numSelected,
    rowCount,
    columns,
    order,
    orderBy,
    onSelectAllClick,
    onRequestSort,
}: TableHeadProps<T>) => {
    const createSortHandler =
        (property: keyof T) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property as keyof T);
        };
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all members",
                        }}
                    />
                </TableCell>
                {columns.map((col) => {
                    return (
                        <TableCell
                            key={col.id as string}
                            align="left"
                            padding="normal"
                            sortDirection={orderBy === col.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === col.id}
                                direction={orderBy === col.id ? order : "asc"}
                                onClick={createSortHandler(col.id as keyof T)}
                            >
                                {col.label}
                                {orderBy === col.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === "desc"
                                            ? "sorted descending"
                                            : "sorted ascending"}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
    );
};

export default Head;
