import React, { useCallback, useState } from "react";

// Page is 0 based
const usePagination = (
    defaultLimit: number,
    triggerRefresh: () => void
): {
    limit: number;
    page: number;
    onRowsPerPageChange: React.ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
    >;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        page: number
    ) => void;
} => {
    const [limit, setLimit] = useState(defaultLimit);
    const [page, setPage] = useState(0);

    const onRowsPerPageChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            setLimit(Number(e.target.value));
            triggerRefresh();
        },
        [triggerRefresh]
    );

    const onPageChange = useCallback(
        (
            _: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
            p: number
        ) => {
            setPage(p);
            triggerRefresh();
        },
        [triggerRefresh]
    );

    return { page, limit, onPageChange, onRowsPerPageChange };
};

export default usePagination;
