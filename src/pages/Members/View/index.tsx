import React from "react";
import Table from "src/components/Table";
import { MemberData } from "..";

const View: React.FC<{
    style: React.CSSProperties;
    toolBarItems: React.ReactElement[];
    data: MemberData[];
    onDelete: (selected: MemberData[keyof MemberData][]) => void;
    onEdit: (selected: MemberData[keyof MemberData]) => void;
    handleRefresh: () => void;
}> = ({ style, toolBarItems, data, onDelete, onEdit, handleRefresh }) => {
    return (
        <Table
            handleRefresh={handleRefresh}
            style={style}
            title="Members"
            rows={data !== undefined ? data : []}
            toolBarItems={toolBarItems}
            columnOrder={["email", "name", "birthday", "phone"]}
            onDelete={onDelete}
            onEdit={onEdit}
            columns={[
                {
                    id: "email",
                    label: "email",
                },
                {
                    id: "name",
                    label: "name",
                },
                {
                    id: "birthday",
                    label: "birthday",
                },
                {
                    id: "phone",
                    label: "phone",
                },
            ]}
        />
    );
};

export default View;
