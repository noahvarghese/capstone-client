import { useEffect, useState } from "react";
import { server } from "src/lib/permalink";

const useNav = (auth: boolean) => {
    const [links, setLinks] = useState<{ name: string; path: string }[]>([]);
    useEffect(() => {
        if (links.length > 0) {
            if (!auth) {
                setLinks([]);
            }
        } else if (auth) {
            fetch(server("settings/nav"), {
                method: "GET",
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data: { [o: string]: boolean }[]) => {
                    const returnVal: { name: string; path: string }[] = [];
                    for (const key of Object.keys(data)) {
                        returnVal.push({
                            name: key,
                            path: `/${key === "home" ? "" : key}`,
                        });
                    }
                    setLinks(returnVal);
                })
                .catch((e) => {
                    console.error(e.message);
                    setLinks([]);
                });
        }
    }, [auth, links.length]);

    return { links };
};

export default useNav;
