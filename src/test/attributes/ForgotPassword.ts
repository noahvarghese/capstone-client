export const validAttributes = {
    email: "test@test.com",
};

export const invalidAttributes = {
    email: "test",
};

export const errors = {
    invalidEmail: "Invalid email",
    emptyEmail: "Email cannot be empty",
};

export const formLabels = { email: /email/i };

const ForgotPasswordAttributes = {
    formLabels,
    errors,
    validAttributes,
    invalidAttributes,
};

export default ForgotPasswordAttributes;
