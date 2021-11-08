import { Box } from "@mui/material";
import { useFetch, useSelect } from "src/hooks";
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
    const { data, handleRefresh } = useFetch<T[]>(
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
                _create={<Create {...createProps} />}
                _edit={<></>}
                _delete={
                    <Delete
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

export default CRUD;
