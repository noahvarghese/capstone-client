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
    <T>(state: T) =>
    (field: "password" | "confirm_password") =>
    (val: string) => {
        let oppositeField =
            field === "password" ? "confirm_password" : "password";
        const res = emptyValidator(field)(val);

        if (res.success) {
            if (
                (state as any)[oppositeField] &&
                (state as any)[oppositeField] !== val
            ) {
                res.success = false;
                res.errorMessage = "passwords do not match";
            }
        }

        return res;
    };
