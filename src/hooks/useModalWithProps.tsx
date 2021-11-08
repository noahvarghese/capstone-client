import { useCallback } from "react";
import { useEffect, useState } from "react";

const useModalWithProps = <T,>(primaryField: keyof T, data?: T[]) => {
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
                // forces false if no value
                // does checks since object is possibly undefined
                const found = data
                    ? data.find(
                          (d: any) => (d as any)[primaryField] === field
                      ) ?? false
                    : false;

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
