import { Action, History, Transition, Location } from "history";
import { useCallback, useContext, useEffect } from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

interface NavigationContextObject {
    basename: string;
    navigator: Omit<
        History,
        "action" | "location" | "back" | "forward" | "listen"
    >;
    static: boolean;
}

type NavigationContextObjectWithBlocker = NavigationContextObject;

export const useBlocker = (
    blocker: (transition: {
        retry: () => void;
        action: Action;
        location: Location;
    }) => void,
    shouldBlock = true
) => {
    const { navigator } = useContext(
        UNSAFE_NavigationContext
    ) as NavigationContextObjectWithBlocker;

    useEffect(() => {
        if (!shouldBlock) return;

        const unblock = navigator.block((transition: Transition) => {
            const autoUnblockingTransition = {
                ...transition,
                retry: () => {
                    unblock();
                    transition.retry();
                },
            };

            blocker(autoUnblockingTransition);
        });
    }, [blocker, navigator, shouldBlock]);
};

export const usePrompt = (
    message: string,
    shouldPrompt = true,
    callback?: () => void
) => {
    const blocker = useCallback(
        (transition) => {
            if (window.confirm(message)) {
                if (callback) callback();
                transition.retry();
            }
        },
        [callback, message]
    );

    useBlocker(blocker, shouldPrompt);
};
