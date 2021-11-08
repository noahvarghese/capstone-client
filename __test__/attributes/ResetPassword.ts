export const validInputs = {
    password: "testtest",
    confirm_password: "testtest",
};

export const invalidInputs = {
    password: "test4568",
    confirm_password: "test123123",
};

export const formLabels = {
    password: /^password$/i,
    confirm_password: /confirm password/i,
};

export const errors = {
    emptyPassword: /^password cannot be empty$/i,
    emptyConfirmPassword: /^confirm password cannot be empty$/i,
    noMatch: "passwords do not match",
};

const ResetPasswordAttributes = {
    validInputs,
    invalidInputs,
    errors,
    formLabels,
};

export default ResetPasswordAttributes;
