import React from "react";
import { useFetch } from "src/hooks";

const Department: React.FC = () => {
    const { data } = useFetch(
        "department",
        {},
        { method: "GET", credentials: "include" }
    );
    console.log(data);
    return <div></div>;
};

export default Department;
