import { RouteComponentProps } from "react-router";

export const protectedRoutes: {
    name: string;
    path: string;
    component?:
        | React.ComponentType<RouteComponentProps<any>>
        | React.ComponentType<any>;
    exact?: boolean;
    protectedProps?: {
        condition: () => boolean;
        redirectPath: string;
    };
}[] = [
    {
        name: "Home",
        path: "/",
        // component: Home,
    },
];
