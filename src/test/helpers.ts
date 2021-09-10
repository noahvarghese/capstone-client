import { Matcher, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { screen } from "./test-utils";
import userEvent from "@testing-library/user-event";

export const fireEmptyChangeEvent = (_element: HTMLElement, value: any) => {
    // need to make a change so react registers "" as a change
    const element = _element as HTMLInputElement;

    act(() => {
        userEvent.type(element, value);
        userEvent.clear(element);
    });
};

export const fillOutForm = (options: {}): void => {
    for (let [key, value] of Object.entries(options)) {
        const inputEl = screen.getByLabelText("* " + key.split("_").join(" "));

        // this accounts for my custom select
        // not for regular HTML select elemtns
        // because it needs to be set visually I need to go and
        // make this more accesible for those who wouldn't operate this with a mouse/touchscreen
        if (inputEl instanceof HTMLSelectElement) {
            userEvent.click(inputEl.parentElement!);
            userEvent.click(getElementByText("div", value as string)!);
            // inputEl.selectedIndex = value as number;
        } else {
            if (value instanceof Date) {
                value = `${value.getFullYear()}-0${value.getMonth()}-0${value.getDay()}`;
            }

            userEvent.type(inputEl, value as string);
        }
    }
};

export const getElementByText = (
    tagName: string,
    elementText: Matcher
): Element | undefined => {
    const elements = Array.from(document.getElementsByTagName(tagName));
    let found;

    for (let el of elements) {
        if (
            elementText instanceof RegExp
                ? elementText.test(el.textContent ?? "")
                : elementText === el.textContent
        ) {
            found = el;
            break;
        }
    }

    return found;
};

// its expected that the button name is the same as the formName (title)
// the expectedElementText is the text that is expected to appear as a result of the form bein submitted
export const submitForm = async (
    formName: Matcher,
    formValues: {},
    expectedElementText: Matcher
) => {
    if (screen.getAllByText(formName).length === 1) {
        const goToFormButton = getElementByText("button", formName);
        if (!goToFormButton) throw new Error(`${formName} button not found`);
        userEvent.click(goToFormButton);
    }
    fillOutForm(formValues);

    const submitButton = getElementByText("button", formName);

    if (!submitButton) throw new Error("submit button not found");

    userEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText(expectedElementText)).toBeInTheDocument();
    });
};
