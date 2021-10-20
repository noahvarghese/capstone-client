import { useEffect } from "react";

const useCleanup = (cleanup: () => void) => {
    useEffect(() => {
        return cleanup;
    }, [cleanup]);
};

export default useCleanup;
