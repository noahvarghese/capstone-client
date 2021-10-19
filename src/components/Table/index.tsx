import React, { useState } from "react";
import Toolbar from "./Toolbar";
import Head, { Column } from "./Head";
import { Box } from "@mui/system";
import {
    Checkbox,
    FormControlLabel,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
} from "@mui/material";

interface TableProps<T> {
    title: string;
    style: React.CSSProperties;
    rows: T[];
    columns: Column<T>[];
    toolBarItems: React.ReactElement[];
    columnOrder: (keyof T)[];
    onDelete: (selected: readonly T[keyof T][]) => void;
}

const EnhancedTable = <T,>({
    rows,
    columns,
    title,
    style,
    toolBarItems,
    columnOrder,
    onDelete,
}: TableProps<T>) => {
    const [order, setOrder] = React.useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = React.useState<keyof T>(columnOrder[0]);
    const [selected, setSelected] = useState<readonly T[keyof T][]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleClick = (_: React.MouseEvent<unknown>, name: T[keyof T]) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly T[keyof T][] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const handleRequestSort = (
        _: React.MouseEvent<unknown>,
        property: keyof T
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked && rows) {
            const newSelecteds = rows.map((n) => n[columnOrder[0]]);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const isSelected = (prop: T[keyof T]) => selected.indexOf(prop) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box style={style}>
            <Paper elevation={3}>
                <Toolbar
                    onDelete={() => onDelete(selected)}
                    toolBarItems={toolBarItems}
                    numSelected={selected.length}
                    title={title}
                />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                    >
                        <Head
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy as string}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows?.length ?? 0}
                            columns={columns}
                        />
                        <TableBody>
                            {rows.map((row, index) => {
                                const isItemSelected = isSelected(
                                    row[columnOrder[0]]
                                );
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(e: any) =>
                                            handleClick(e, row[columnOrder[0]])
                                        }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={
                                            (row[
                                                columnOrder[0]
                                            ] as unknown as string) + index
                                        }
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                            />
                                        </TableCell>

                                        {columnOrder.map((col, index) => (
                                            <TableCell
                                                key={JSON.stringify(col)}
                                                id={index === 0 ? labelId : ""}
                                                scope={index === 0 ? "row" : ""}
                                                align="left"
                                            >
                                                {row[col]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}

                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={5} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
            />
        </Box>
    );
};

export default EnhancedTable;
