export const emptyValidator = (field: string) => (val: string) => {
    let res: { success: boolean; errorMessage: string } = {
        success: true,
        errorMessage: "",
    };

    if (val.trim() === "") {
        res.success = false;
        res.errorMessage = `${field.split("_").join(" ")} cannot be empty`;
        return res;
    }

    return res;
};

// abstracts out the function to validate passwords
// returns a function that applies the field name to the validator
// second function is the validator
export const passwordValidator =
    <T, X extends string>(state: T) =>
    (field: X) =>
    (val: string) => {
        const res = emptyValidator(field)(val);

        if (res.success) {
            if ((state as any)[field] && (state as any)[field] !== val) {
                res.success = false;
                res.errorMessage = "passwords do not match";
            }
        }

        return res;
    };
