const formLabels = {
    password: /^\* password$/i,
    confirmPassword: /confirm password/i,
};

const validInputs = {
    first_name: "Test",
    last_name: "Test",
    email: "test@test.com",
    address: "123 Anywhere St",
    city: "WhoKnows",
    postal_code: "L6L 1Z3",
    province: "ON",
    birthday: new Date(1996, 8, 7),
    phone: 9053393294,
    business_code: "3are123asdf",
    password: "testtest",
    confirm_password: "testtest",
};

const invalidInputs = {
    password: "testttt",
    confirmPassword: "testtest",
};

const errors = {
    emptyPassword: /^password cannot be empty$/i,
    emptyConfirmPassword: /^confirm password cannot be empty$/i,
    noMatch: "passwords do not match",
};

const RegisterAttributes = {
    formLabels,
    validInputs,
    invalidInputs,
    errors,
};

export default RegisterAttributes;
