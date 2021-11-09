import { Box } from "@mui/material";
import React from "react";
import { useFetch, useSelect } from "src/hooks";
import Create, { CreateProps } from "./Create";
import Delete, { DeleteProps } from "./Delete";
import Read, { ReadProps } from "./Read";
import { UpdateProps } from "./Update";

interface ReceivedCreateProps extends Omit<CreateProps, "handleRefresh"> {}
interface ReceivedUpdateProps extends Omit<UpdateProps, "handleRefresh"> {}
interface ReceivedReadProps<T> extends Omit<ReadProps<T>, "handleRefresh"> {}
interface ReceivedDeleteProps<T>
    extends Omit<DeleteProps<T>, "handleRefresh"> {}

export interface CrudProps<T> {
    name: string;
    url: string;
    primaryField: keyof T;
    createProps: ReceivedCreateProps;
    readProps: ReceivedReadProps<T>;
    updateProps?: ReceivedUpdateProps;
    deleteProps: ReceivedDeleteProps<T>;
}

const CRUD = <T extends object>({
    primaryField,
    deleteProps,
    readProps,
    createProps,
    name,
    url,
}: CrudProps<T>) => {
    const { data, handleRefresh, isRefreshing } = useFetch<T[]>(
        name,
        [],
        { method: "GET", credentials: "include" },
        "data"
    );

    const { selected, handleSelect, setSelected, isSelected, handleSelectAll } =
        useSelect<T>(primaryField, data);

    return (
        <Box
            className={name}
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "4rem",
                marginTop: "5rem",
            }}
        >
            <Read
                isRefreshing={isRefreshing}
                primaryField={primaryField}
                setSelected={setSelected}
                selected={selected}
                handleSelect={handleSelect}
                isSelected={isSelected}
                handleSelectAll={handleSelectAll}
                name={name}
                data={data}
                handleRefresh={handleRefresh}
                {...readProps}
                _create={
                    <Create {...createProps} handleRefresh={handleRefresh} />
                }
                _edit={<></>}
                _delete={
                    <Delete
                        handleRefresh={handleRefresh}
                        selected={selected}
                        name={name}
                        url={url}
                        {...deleteProps}
                    />
                }
            />
        </Box>
    );
};

const comparator = <T,>(
    prevProps: Readonly<CrudProps<T>>,
    nextProps: Readonly<CrudProps<T>>
): boolean => {
    return prevProps.name !== nextProps.name && prevProps.url !== nextProps.url;
};

export default React.memo(CRUD, comparator) as typeof CRUD;
