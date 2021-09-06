import { fireEvent } from "./test-utils";

export const fireEmptyChangeEvent = (
    element: Document | Node | Element | Window,
    options: {}
) => {
    // need to make a change so react registers "" as a change
    fireEvent.change(element, options);
    fireEvent.change(element, { target: { value: "" } });
};
