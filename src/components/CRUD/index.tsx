import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useFetch, useSelect } from "src/hooks";
import Emitter from "src/services/emitter";
import Create, { CreateProps } from "./Create";
import Delete, { DeleteProps } from "./Delete";
import Read, { ReadProps } from "./Read";
import { UpdateProps } from "./Update";

export interface CrudProps<T> {
    name: string;
    url: string;
    primaryField: keyof T;
    createProps: CreateProps;
    readProps: ReadProps<T>;
    updateProps?: UpdateProps;
    deleteProps: DeleteProps<T>;
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
        url,
        [],
        { method: "GET", credentials: "include" },
        "data"
    );

    const {
        selected,
        handleSelect,
        setSelected,
        isSelected,
        handleSelectAll,
        unselectAll,
    } = useSelect<T>(primaryField, data);

    useEffect(() => {
        Emitter.on("DATA_RECEIVED", unselectAll);
        return () => {
            Emitter.off("DATA_RECEIVED");
        };
    }, [isRefreshing, unselectAll, selected]);

    useEffect(() => {
        Emitter.on("REFRESH", () => {
            handleRefresh();
        });

        return () => {
            Emitter.off("REFRESH");
        };
    }, [handleRefresh, isRefreshing, unselectAll]);

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
                {...readProps}
                _create={<Create {...createProps} />}
                _edit={<></>}
                _delete={
                    selected.length > 0 ? (
                        <Delete
                            selected={selected}
                            name={name}
                            url={url}
                            {...deleteProps}
                        />
                    ) : (
                        <></>
                    )
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
