import { Matcher } from "@testing-library/react";
import { fireEvent, screen } from "./test-utils";

export const fireEmptyChangeEvent = (
    element: Document | Node | Element | Window,
    options: {}
) => {
    // need to make a change so react registers "" as a change
    fireEvent.change(element, options);
    fireEvent.change(element, { target: { value: "" } });
};

export const fillOutForm = (options: {}): void => {
    for (let [key, value] of Object.entries(options)) {
        const inputEl = screen.getByLabelText("* " + key.split("_").join(" "));
        fireEvent.change(inputEl, { target: { value } });
    }
};

export const getElementByText = (
    tagName: string,
    elementText: Matcher
): Element | undefined => {
    return Array.from(document.getElementsByTagName(tagName)).find((el) =>
        elementText instanceof RegExp
            ? elementText.test(el.textContent ?? "")
            : elementText === el.textContent
    );
};

// its expected that the button name is the same as the formName (title)
// the expectedElementText is the text that is expected to appear as a result of the form bein submitted
export const submitForm = (
    formName: Matcher,
    formValues: {},
    expectedElementText: Matcher
) => {
    if (screen.getAllByText(formName).length === 1) {
        const goToFormButton = getElementByText("button", formName);
        if (!goToFormButton) throw new Error(`${formName} button not found`);
        fireEvent.click(goToFormButton);
    }
    fillOutForm(formValues);

    const submitButton = getElementByText("button", formName);

    if (!submitButton) throw new Error("submit button not found");

    fireEvent.click(submitButton);

    const expectedEl = screen.getByText(expectedElementText);
    expect(expectedEl).toBeInTheDocument();
};
