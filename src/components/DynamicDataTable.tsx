import { Box, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DynamicForm, { FormInputOptions } from "./DynamicForm";
import DynamicTable from "./DynamicTable";

interface DynamicDataTableProps<T extends { id: number }> {
    columns: { key: keyof T; value: string }[];
    deleteUrl: (id?: number) => string;
    description: (model?: T) => string;
    disableDeleteForRow?: (model: T) => boolean;
    disableDeleteForTable?: boolean;
    disableForm?: boolean;
    formOptions: {
        [x: string]: FormInputOptions;
    };
    getUrl: string;
    modelName: string;
    navigateUrl: (id: number) => string;
    postUrl: string;
    setAlert: Dispatch<
        SetStateAction<{
            message: string;
            severity?: "success" | "error" | "warning" | "info" | undefined;
        }>
    >;
}

const DynamicDataTable = <T extends { id: number }>({
    columns,
    deleteUrl,
    description,
    disableDeleteForRow,
    disableDeleteForTable,
    disableForm,
    formOptions,
    getUrl,
    modelName,
    navigateUrl,
    postUrl,
    setAlert,
}: DynamicDataTableProps<T>) => {
    const [refresh, setRefresh] = useState(true);
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        if (refresh) {
            const controller = new AbortController();

            fetch(getUrl, {
                method: "GET",
                credentials: "include",
                mode: "cors",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (res.ok) {
                        setData(await res.json());
                    }
                })
                .catch((e) => {
                    const { message } = e as Error;
                    console.error(message);
                    setAlert({
                        message: "Unable to retrieve data",
                        severity: "error",
                    });
                })
                .finally(() => setRefresh(false));

            return () => {
                controller.abort();
            };
        }
    }, [getUrl, refresh, setAlert]);

    return (
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
            }}
        >
            <Typography variant="h5" variantMapping={{ h5: "h3" }}>
                {modelName}
                {"s"}
            </Typography>
            <Box
                style={{
                    display: "flex",
                    gap: "2rem",
                }}
            >
                <DynamicForm
                    disableSubmit={disableForm}
                    fetchOptions={{
                        method: "POST",
                        credentials: "include",
                        mode: "cors",
                    }}
                    formOptions={formOptions}
                    resetOnSubmit={true}
                    setAlert={setAlert}
                    title={`Add ${modelName}`}
                    triggerRefresh={() => setRefresh(true)}
                    url={postUrl}
                />
                <DynamicTable
                    columns={columns}
                    data={data}
                    deleteUrl={deleteUrl}
                    description={description}
                    disableDeleteForRow={disableDeleteForRow}
                    disableDeleteForTable={disableDeleteForTable}
                    navigateUrl={navigateUrl}
                    setAlert={setAlert}
                    triggerRefresh={() => setRefresh(true)}
                />
            </Box>
        </Box>
    );
};

export default DynamicDataTable;
