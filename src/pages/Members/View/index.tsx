import React from "react";
import Table from "src/components/Table";
import { MemberData } from "..";

const View: React.FC<{
    style: React.CSSProperties;
    toolBarItems: React.ReactElement[];
    data: MemberData[];
    onDelete: (selected: readonly MemberData[keyof MemberData][]) => void;
}> = ({ style, toolBarItems, data, onDelete }) => {
    return (
        <Table
            style={style}
            title="Members"
            rows={data !== undefined ? data : []}
            toolBarItems={toolBarItems}
            columnOrder={["email", "name", "birthday", "phone"]}
            onDelete={onDelete}
            columns={[
                {
                    id: "email",
                    numeric: false,
                    disablePadding: false,
                    label: "email",
                },
                {
                    id: "name",
                    numeric: false,
                    disablePadding: false,
                    label: "name",
                },
                {
                    id: "birthday",
                    numeric: false,
                    disablePadding: false,
                    label: "birthday",
                },
                {
                    id: "phone",
                    numeric: false,
                    disablePadding: false,
                    label: "phone",
                },
            ]}
        />
    );
};

export default View;
