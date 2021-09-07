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

        // this accounts for my custom select
        // not for regular HTML select elemtns
        // because it needs to be set visually I need to go and
        // make this more accesible for those who wouldn't operate this with a mouse/touchscreen
        if (inputEl instanceof HTMLSelectElement) {
            fireEvent.click(inputEl.parentElement!);
            fireEvent.click(getElementByText("div", value as string)!);
            // inputEl.selectedIndex = value as number;
        } else {
            if (value instanceof Date) {
                value = `${value.getFullYear()}-0${value.getMonth()}-0${value.getDay()}`;
            }

            fireEvent.change(inputEl, { target: { value } });
        }
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
