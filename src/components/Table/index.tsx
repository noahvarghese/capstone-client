import React from "react";
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
    style?: React.CSSProperties;
    rows: T[];
    columnOrder: (keyof T)[];
    columns: Column<T>[];
    handleSelect: (e: React.MouseEvent<unknown>, name: T[keyof T]) => void;
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSelected: (t: T[keyof T]) => boolean;
    toolBarItems?: React.ReactElement[];
    handleRefresh?: () => void;
    primaryField: keyof T;
    selected: T[];
    _delete: React.ReactElement;
    _edit: React.ReactElement;
    _create: React.ReactElement;
}

const EnhancedTable = <T extends Partial<{ id: number }>>({
    rows,
    columns,
    title,
    style,
    selected,
    handleSelect,
    handleSelectAll,
    isSelected,
    toolBarItems,
    columnOrder,
    primaryField,
    handleRefresh,
    _delete,
    _create,
    _edit,
}: TableProps<T>) => {
    const [order, setOrder] = React.useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = React.useState<keyof T>(columnOrder[0]);
    // needs to be managed by the component above
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box style={style}>
            <Paper elevation={3}>
                <Toolbar
                    handleRefresh={handleRefresh}
                    _delete={_delete}
                    _create={_create}
                    _edit={_edit}
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
                            onSelectAllClick={handleSelectAll}
                            onRequestSort={handleRequestSort}
                            rowCount={rows?.length ?? 0}
                            columns={columns}
                        />
                        <TableBody>
                            {rows.map((row, index) => {
                                const isItemSelected = isSelected(
                                    row[primaryField]
                                );
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(e: any) =>
                                            handleSelect(e, row[primaryField])
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
