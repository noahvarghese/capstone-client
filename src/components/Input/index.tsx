import Checkbox, { SingleCheckboxProps } from "./Checkbox";
import Hidden, { HiddenProps } from "./Hidden";
import MultipleCheckbox, { MultipleCheckboxProps } from "./MultipleCheckbox";
import Radio, { RadioGroupProps } from "./Radio";
import Select, { SelectProps } from "./Select";
import Text, { TextInputProps } from "./Text";

export interface BaseProps {
    disabled?: boolean;
}

export type InputProps = {
    hidden?: HiddenProps;
    input?: TextInputProps;
    multipleCheckbox?: MultipleCheckboxProps;
    radio?: RadioGroupProps;
    select?: SelectProps;
    singleCheckbox?: SingleCheckboxProps;
};

function exactlyOneKeySet(opts: Record<string, unknown>) {
    let optionSet = false;

    // Disbaled as we are using the standard convention for discarding a variable -> '_'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, value] of Object.entries(opts)) {
        if (value !== undefined) {
            if (optionSet) return false;
            optionSet = true;
        }
    }

    return optionSet;
}

const Input: React.FC<InputProps> = (props) => {
    if (!exactlyOneKeySet(props)) throw new Error("Only one option may be set");

    const { hidden, input, multipleCheckbox, radio, select, singleCheckbox } =
        props;

    if (hidden) return <Hidden {...hidden} />;
    if (input) return <Text {...input} />;
    if (multipleCheckbox) return <MultipleCheckbox {...multipleCheckbox} />;
    if (radio) return <Radio {...radio} />;
    if (select) return <Select {...select} />;
    if (singleCheckbox) return <Checkbox {...singleCheckbox} />;

    return null;
};

export default Input;
