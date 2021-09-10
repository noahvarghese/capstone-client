export const validInputs = {
    password: "testtest",
    confirmPassword: "testtest",
};

export const invalidInputs = {
    password: "test4568",
    confirmPassword: "test123123",
};

export const formLabels = {
    password: /^\* password$/i,
    confirmPassword: /confirm password/i,
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
