import { useState, useCallback } from "react";

const useSelect = <T,>(primaryField: keyof T, data: T[]) => {
    const [selected, setSelected] = useState<T[]>([]);

    const handleSelectAll = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.checked) setSelected(data);
            else setSelected([]);
        },
        [data]
    );

    const handleSelect = useCallback(
        (_: React.MouseEvent<unknown>, name: T[keyof T]) => {
            const selectedIndex = selected.findIndex(
                (d) => d[primaryField] === name
            );
            let newSelected: T[] = [];

            if (selectedIndex === -1) {
                const selectedItem = data.find((d) => {
                    return d[primaryField] === name;
                })!;
                newSelected = newSelected.concat(selected, selectedItem);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1)
                );
            }

            setSelected(newSelected);
        },
        [data, selected, primaryField]
    );

    const isSelected = useCallback(
        (item: T[keyof T]) =>
            selected.findIndex((s) => s[primaryField] === item) !== -1,
        [primaryField, selected]
    );
    return { selected, handleSelect, setSelected, handleSelectAll, isSelected };
};

export default useSelect;
