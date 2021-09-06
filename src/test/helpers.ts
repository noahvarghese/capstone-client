import { fireEvent, screen } from "./test-utils";

export const fireEmptyChangeEvent = (
    element: Document | Node | Element | Window,
    options: {}
) => {
    // need to make a change so react registers "" as a change
    fireEvent.change(element, options);
    fireEvent.change(element, { target: { value: "" } });
};

export const changeAllInputs = (options: {}): void => {
    for (let [key, value] of Object.entries(options)) {
        const inputEl = screen.getByLabelText("* " + key.split("_").join(" "));
        fireEvent.change(inputEl, { target: { value } });
    }
};
