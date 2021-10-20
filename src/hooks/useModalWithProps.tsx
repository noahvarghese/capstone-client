import { useCallback } from "react";
import { useEffect, useState } from "react";

const useModalWithProps = <T,>(primaryField: string, data?: any) => {
    const [state, setState] = useState<T[]>([]);
    const [openModal, setModalOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setModalOpen(true);
        const handleClose = () => setModalOpen(false);
        if (
            (Array.isArray(state) && state.length > 0) ||
            (!Array.isArray(state) && Boolean(state))
        )
            handleOpen();
        else handleClose();
    }, [state]);

    const handleOpen = useCallback(
        (selected: unknown[]) => {
            const newSelected = [];

            for (const field of selected) {
                const found = data.find(
                    (d: any) => (d as any)[primaryField] === field
                );
                if (found) newSelected.push(found);
                else console.error(field + " not found");
            }

            setState(newSelected);
        },
        [primaryField, data]
    );

    return {
        open: openModal,
        handleOpen,
        handleClose: () => setState([]),
        selected: state,
    };
};

export default useModalWithProps;
