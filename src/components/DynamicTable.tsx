import { Delete } from "@mui/icons-material";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useHistory } from "react-router-dom";
import Confirm from "./Confirmation";

interface DynamicTableProps<T extends { id: number }> {
    columns: { key: keyof T; value: string }[];
    data: T[];
    deleteUrl: (id?: number) => string;
    description: (model?: T) => string;
    disableDeleteForRow?: (model: T) => boolean;
    disableDeleteForTable?: boolean;
    navigateUrl: (id: number) => string;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
    triggerRefresh: () => void;
}

const DynamicTable = <T extends { id: number }>({
    columns,
    data,
    deleteUrl,
    description,
    disableDeleteForRow,
    disableDeleteForTable,
    navigateUrl,
    setAlert,
    triggerRefresh,
}: DynamicTableProps<T>): React.ReactElement => {
    const history = useHistory();
    const [selected, setSelected] = useState<T | undefined>();
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <TableContainer component={Paper} style={{ height: "min-content" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((c) => (
                                <TableCell key={"header_" + c.key}>
                                    {c.value}
                                </TableCell>
                            ))}
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((d) => (
                            <TableRow
                                key={"row" + d.id}
                                hover={true}
                                onClick={() => history.push(navigateUrl(d.id))}
                            >
                                {columns.map((c) => (
                                    <TableCell
                                        key={
                                            "row_cell" +
                                            d.id.toString() +
                                            c.key +
                                            "_" +
                                            (d[c.key] as unknown as string)
                                        }
                                    >
                                        {/*
                                         * Print readable version of column depending on types
                                         * ex. booleans do not display unless converted to strings
                                         */}
                                        {typeof d[c.key] !== "string"
                                            ? (
                                                  d[c.key] as unknown as string
                                              ).toString()
                                            : d[c.key]}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    {disableDeleteForTable ||
                                    (disableDeleteForRow &&
                                        disableDeleteForRow(d)) ? null : (
                                        <Button
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelected(d);
                                                setShowDelete(true);
                                            }}
                                        >
                                            <Delete />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Confirm
                description={description(selected)}
                method="DELETE"
                title="Delete"
                onClose={() => {
                    setShowDelete(false);
                    setSelected(undefined);
                }}
                open={showDelete}
                setAlert={setAlert}
                url={deleteUrl(selected?.id)}
                triggerRefresh={triggerRefresh}
            />
        </>
    );
};

export default DynamicTable;
