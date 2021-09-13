import dotenv from "dotenv";
import Logs from "./logs";
dotenv.config();

const { REACT_APP_TARGET_ENV } = process.env;

let clientURL: string =
    process.env[`REACT_APP_ENV_${REACT_APP_TARGET_ENV}_CLIENT`] ?? "capstone.noahvarghese.me";
let serverURL: string =
    process.env[`REACT_APP_ENV_${REACT_APP_TARGET_ENV}_SERVER`] ?? "api.capstone.noahvarghese.me";

if (clientURL !== "") {
    clientURL = `http${
        REACT_APP_TARGET_ENV !== "LOCAL" ? "s" : ""
    }://${clientURL}/`;
} else {
    Logs.Error(
        `No client origin found for environment ${REACT_APP_TARGET_ENV}`
    );
}

if (serverURL !== "") {
    serverURL = `http${
        REACT_APP_TARGET_ENV !== "LOCAL" ? "s" : ""
    }://${serverURL}/`;
} else {
    Logs.Error(
        `No server origin found for environment ${REACT_APP_TARGET_ENV}`
    );
}

export const client = clientURL;
export const server = serverURL;
