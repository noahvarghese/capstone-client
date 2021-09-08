const validLoginAttributes = {
    email: "test@test.com",
    password: "testtest",
};

const invalidLoginAttributes = {
    notEmail: "test",
    invalidEmail: "test123@test.com",
    password: "yoloyolo",
};

const errors = {
    invalidEmail: "Invalid email",
    emptyEmail: "Email cannot be empty",
    emptyPassword: "password cannot be empty",
};

const formLabels = {
    email: /email/i,
    password: /password/i,
};

const LoginAttributes = {
    formLabels,
    validAttributes: validLoginAttributes,
    invalidAttributes: invalidLoginAttributes,
    errors,
};

export default LoginAttributes;
