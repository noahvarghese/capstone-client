import { Action } from "redux";

export interface CustomAction extends Action {
    type: string;
    payload: any;
}
