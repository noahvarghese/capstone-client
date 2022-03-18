import { useCallback, useState } from "react";

const useSort = (
    toggleRefresh: () => void
): {
    sortColumn: string;
    sortOrder: "asc" | "desc";
    sortCallback: (field: string) => () => void;
} => {
    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const sortCallback = useCallback(
        (field: string) => () => {
            if (sortColumn !== field) {
                setSortColumn(field);
                if (sortOrder === "desc") setSortOrder("asc");
            } else {
                if (sortOrder === "asc") setSortOrder("desc");
                else {
                    setSortOrder("asc");
                    setSortColumn("");
                }
            }
            toggleRefresh();
        },
        [sortColumn, sortOrder, toggleRefresh]
    );
    return { sortColumn, sortOrder, sortCallback };
};

export default useSort;
